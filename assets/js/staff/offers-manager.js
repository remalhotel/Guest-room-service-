// ==================== OFFERS MANAGER - STAFF DASHBOARD ====================
// Gestion des offres publicitaires par l'admin

class OffersManager {
    constructor() {
        this.offers = [];
        this.currentFilter = 'all';
        this.init();
    }
    
    async init() {
        this.setupUI();
        await this.loadOffers();
    }
    
    setupUI() {
        // Vérifier si la section existe déjà
        if (document.getElementById('offersManagementSection')) return;
        
        // Créer le conteneur de gestion
        const container = document.createElement('div');
        container.id = 'offersManagementSection';
        container.className = 'hidden';
        container.style.cssText = `
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        `;
        container.innerHTML = `
            <div style="padding: 20px;">
                <!-- En-tête -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #DCA773; font-size: 20px; font-weight: bold; margin: 0;">
                        📢 Offers Management
                    </h2>
                    <button onclick="offersManager.showAddForm()" style="
                        background: #DCA773;
                        color: #000;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 25px;
                        font-weight: bold;
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        + Add New Offer
                    </button>
                </div>
                
                <!-- Filtres -->
                <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
                    <button onclick="offersManager.filterOffers('all')" class="offer-filter-btn active" data-filter="all">✨ All</button>
                    <button onclick="offersManager.filterOffers('falaj')" class="offer-filter-btn" data-filter="falaj">🍽️ Falaj</button>
                    <button onclick="offersManager.filterOffers('sarab')" class="offer-filter-btn" data-filter="sarab">🍸 Sarab</button>
                    <button onclick="offersManager.filterOffers('alrodah')" class="offer-filter-btn" data-filter="alrodah">🕌 Al Rodah</button>
                    <button onclick="offersManager.filterOffers('spa')" class="offer-filter-btn" data-filter="spa">💆 Spa</button>
                </div>
                
                <!-- Liste des offres -->
                <div id="offersList" style="display: grid; gap: 12px;"></div>
            </div>
        `;
        
        // Ajouter au body ou à un conteneur principal
        const mainContent = document.querySelector('main') || document.querySelector('.main-content') || document.body;
        mainContent.appendChild(container);
        
        // Ajouter les styles pour les boutons de filtre
        if (!document.getElementById('offersManagerStyles')) {
            const style = document.createElement('style');
            style.id = 'offersManagerStyles';
            style.textContent = `
                .offer-filter-btn {
                    padding: 8px 16px;
                    border-radius: 20px;
                    border: 1px solid rgba(220, 167, 115, 0.3);
                    background: rgba(28, 25, 23, 0.8);
                    color: #a8a29e;
                    font-weight: bold;
                    font-size: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .offer-filter-btn:hover {
                    border-color: #DCA773;
                    color: #DCA773;
                }
                .offer-filter-btn.active {
                    background: #DCA773;
                    color: #000;
                    border-color: #DCA773;
                }
                
                .offer-manage-card {
                    background: rgba(28, 25, 23, 0.9);
                    border: 1px solid rgba(220, 167, 115, 0.3);
                    border-radius: 15px;
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s ease;
                    gap: 10px;
                }
                
                .offer-manage-card:hover {
                    border-color: #DCA773;
                    box-shadow: 0 5px 20px rgba(220, 167, 115, 0.2);
                }
                
                .offer-status {
                    display: inline-block;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 8px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .offer-status.active {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                    border: 1px solid #10b981;
                }
                
                .offer-status.inactive {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border: 1px solid #ef4444;
                }
                
                .offer-action-btn {
                    padding: 7px 12px;
                    border-radius: 10px;
                    font-size: 9px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 1px solid;
                    white-space: nowrap;
                }
                
                .offer-action-btn:hover {
                    transform: scale(1.05);
                }
                
                .offer-form-input {
                    width: 100%;
                    background: #0a0908;
                    border: 1px solid rgba(220, 167, 115, 0.3);
                    border-radius: 10px;
                    padding: 12px;
                    color: #fff;
                    margin-top: 5px;
                    font-size: 12px;
                }
                
                .offer-form-input:focus {
                    border-color: #DCA773;
                    outline: none;
                    box-shadow: 0 0 10px rgba(220, 167, 115, 0.3);
                }
                
                .offer-form-label {
                    color: #DCA773;
                    font-size: 9px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    async loadOffers() {
        try {
            const { data, error } = await supabase
                .from('experiences_offers')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (data) {
                this.offers = data;
            } else {
                this.offers = [];
            }
        } catch (e) {
            console.error('Error loading offers:', e);
            this.offers = [];
        }
        
        this.renderOffers();
    }
    
    renderOffers() {
        const list = document.getElementById('offersList');
        if (!list) return;
        
        const filtered = this.currentFilter === 'all' 
            ? this.offers 
            : this.offers.filter(o => o.category === this.currentFilter);
        
        if (filtered.length === 0) {
            list.innerHTML = `
                <p style="text-align: center; color: #a8a29e; padding: 30px; font-size: 12px;">
                    No offers found. Click "+ Add New Offer" to create one.
                </p>
            `;
            return;
        }
        
        list.innerHTML = filtered.map(offer => `
            <div class="offer-manage-card">
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                        <h3 style="color: #DCA773; font-size: 13px; font-weight: bold; margin: 0;">
                            ${offer.title || 'Untitled'}
                        </h3>
                        <span class="offer-status ${offer.is_active ? 'active' : 'inactive'}">
                            ${offer.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <p style="color: #a8a29e; font-size: 10px; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${offer.venue || 'Unknown'} • ${offer.price || 'N/A'}
                    </p>
                </div>
                <div style="display: flex; gap: 6px; flex-shrink: 0;">
                    <button onclick="offersManager.editOffer('${offer.id}')" class="offer-action-btn" style="
                        background: rgba(220, 167, 115, 0.15);
                        color: #DCA773;
                        border-color: #DCA773;
                    ">✏️</button>
                    <button onclick="offersManager.toggleActive('${offer.id}')" class="offer-action-btn" style="
                        background: rgba(16, 185, 129, 0.15);
                        color: #10b981;
                        border-color: #10b981;
                    ">${offer.is_active ? '⏸' : '▶'}</button>
                    <button onclick="offersManager.deleteOffer('${offer.id}')" class="offer-action-btn" style="
                        background: rgba(239, 68, 68, 0.15);
                        color: #ef4444;
                        border-color: #ef4444;
                    ">🗑</button>
                </div>
            </div>
        `).join('');
    }
    
    filterOffers(category) {
        this.currentFilter = category;
        
        document.querySelectorAll('.offer-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            }
        });
        
        this.renderOffers();
    }
    
    showAddForm() {
        this.showForm(null);
    }
    
    editOffer(id) {
        const offer = this.offers.find(o => o.id === id);
        if (offer) {
            this.showForm(offer);
        }
    }
    
    showForm(offer) {
        const isEdit = !!offer;
        
        // Supprimer l'ancien formulaire
        const existingForm = document.getElementById('offerFormModal');
        if (existingForm) existingForm.remove();
        
        const formModal = document.createElement('div');
        formModal.id = 'offerFormModal';
        formModal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.9);
            padding: 20px;
        `;
        
        formModal.innerHTML = `
            <div style="
                background: #1c1917;
                border: 2px solid #DCA773;
                border-radius: 20px;
                padding: 25px;
                max-width: 500px;
                width: 100%;
                max-height: 85vh;
                overflow-y: auto;
            ">
                <h2 style="color: #DCA773; font-size: 16px; font-weight: bold; margin-bottom: 20px;">
                    ${isEdit ? '✏️ Edit Offer' : '➕ Add New Offer'}
                </h2>
                
                <div style="display: grid; gap: 12px;">
                    <div>
                        <label class="offer-form-label">Title *</label>
                        <input id="formTitle" class="offer-form-input" value="${offer?.title || ''}" placeholder="e.g., Sunset Dinner">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label class="offer-form-label">Category *</label>
                            <select id="formCategory" class="offer-form-input">
                                <option value="falaj" ${offer?.category === 'falaj' ? 'selected' : ''}>🍽️ Falaj Restaurant</option>
                                <option value="sarab" ${offer?.category === 'sarab' ? 'selected' : ''}>🍸 Sarab Lounge</option>
                                <option value="alrodah" ${offer?.category === 'alrodah' ? 'selected' : ''}>🕌 Al Rodah</option>
                                <option value="spa" ${offer?.category === 'spa' ? 'selected' : ''}>💆 Spa</option>
                            </select>
                        </div>
                        <div>
                            <label class="offer-form-label">Price</label>
                            <input id="formPrice" class="offer-form-input" value="${offer?.price || ''}" placeholder="e.g., 150 AED">
                        </div>
                    </div>
                    
                    <div>
                        <label class="offer-form-label">Venue *</label>
                        <input id="formVenue" class="offer-form-input" value="${offer?.venue || ''}" placeholder="e.g., Falaj Restaurant">
                    </div>
                    
                    <div>
                        <label class="offer-form-label">Short Description</label>
                        <input id="formDescription" class="offer-form-input" value="${offer?.description || ''}" placeholder="e.g., Romantic dinner with ocean view">
                    </div>
                    
                    <div>
                        <label class="offer-form-label">Full Details</label>
                        <textarea id="formDetails" class="offer-form-input" rows="3" placeholder="Full description...">${offer?.details || ''}</textarea>
                    </div>
                    
                    <div>
                        <label class="offer-form-label">Badge</label>
                        <input id="formBadge" class="offer-form-input" value="${offer?.badge || ''}" placeholder="e.g., Popular, New, Exclusive">
                    </div>
                    
                    <div>
                        <label class="offer-form-label">Image URL</label>
                        <input id="formImage" class="offer-form-input" value="${offer?.image_url || ''}" placeholder="https://...">
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button onclick="offersManager.saveOffer('${offer?.id || ''}')" style="
                        flex: 1;
                        background: #DCA773;
                        color: #000;
                        border: none;
                        padding: 14px;
                        border-radius: 15px;
                        font-weight: bold;
                        font-size: 12px;
                        cursor: pointer;
                    ">${isEdit ? 'Update Offer' : 'Create Offer'}</button>
                    <button onclick="document.getElementById('offerFormModal').remove()" style="
                        background: rgba(239, 68, 68, 0.2);
                        color: #ef4444;
                        border: 1px solid #ef4444;
                        padding: 14px 20px;
                        border-radius: 15px;
                        font-size: 12px;
                        cursor: pointer;
                    ">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(formModal);
        
        // Fermer en cliquant à l'extérieur
        formModal.addEventListener('click', (e) => {
            if (e.target === formModal) {
                formModal.remove();
            }
        });
    }
    
    async saveOffer(id) {
        const title = document.getElementById('formTitle').value.trim();
        const category = document.getElementById('formCategory').value;
        const venue = document.getElementById('formVenue').value.trim();
        
        if (!title) {
            alert('Title is required');
            return;
        }
        
        if (!venue) {
            alert('Venue is required');
            return;
        }
        
        const payload = {
            title: title,
            category: category,
            venue: venue,
            price: document.getElementById('formPrice').value.trim(),
            description: document.getElementById('formDescription').value.trim(),
            details: document.getElementById('formDetails').value.trim(),
            badge: document.getElementById('formBadge').value.trim(),
            image_url: document.getElementById('formImage').value.trim(),
            is_active: true,
            updated_at: new Date()
        };
        
        try {
            if (id) {
                await supabase
                    .from('experiences_offers')
                    .update(payload)
                    .eq('id', id);
            } else {
                await supabase
                    .from('experiences_offers')
                    .insert(payload);
            }
            
            document.getElementById('offerFormModal').remove();
            await this.loadOffers();
            
            alert('✅ Offer saved successfully!');
        } catch (e) {
            console.error('Error saving offer:', e);
            alert('❌ Error saving offer: ' + e.message);
        }
    }
    
    async toggleActive(id) {
        const offer = this.offers.find(o => o.id === id);
        if (!offer) return;
        
        try {
            await supabase
                .from('experiences_offers')
                .update({ is_active: !offer.is_active })
                .eq('id', id);
            
            await this.loadOffers();
        } catch (e) {
            console.error('Error toggling offer:', e);
        }
    }
    
    async deleteOffer(id) {
        if (!confirm('Delete this offer permanently?')) return;
        
        try {
            await supabase
                .from('experiences_offers')
                .delete()
                .eq('id', id);
            
            await this.loadOffers();
        } catch (e) {
            console.error('Error deleting offer:', e);
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.offersManager = new OffersManager();
});

// Fonction pour afficher la section
function showOffersManagement() {
    // Masquer toutes les sections
    document.querySelectorAll('.section, [id$="Section"]').forEach(s => {
        if (s.id !== 'offersManagementSection') {
            s.classList.add('hidden');
        }
    });
    
    // Afficher la section offres
    const section = document.getElementById('offersManagementSection');
    if (section) {
        section.classList.remove('hidden');
    }
    
    // Mettre à jour les boutons de navigation
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const navBtn = document.getElementById('navBtnOffers');
    if (navBtn) {
        navBtn.classList.add('active');
    }
}
