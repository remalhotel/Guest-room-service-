// ==================== OFFERS MANAGER ====================
// Gestion des offres publicitaires

// S'assurer que supabase est défini
if (typeof supabase === 'undefined' && typeof supabaseClient !== 'undefined') {
    window.supabase = supabaseClient;
}

class OffersManager {
    constructor() {
        this.offers = [];
        this.currentFilter = 'all';
        this.init();
    }
    
    async init() {
        this.setupStyles();
        await this.loadOffers();
    }
    
    setupStyles() {
        if (document.getElementById('offersManagerStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'offersManagerStyles';
        style.textContent = `
            .offer-filter-btn { padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(220,167,115,0.3); background: rgba(28,25,23,0.8); color: #a8a29e; font-weight: bold; font-size: 10px; cursor: pointer; transition: all 0.3s ease; }
            .offer-filter-btn.active { background: #DCA773; color: #000; border-color: #DCA773; }
            .offer-manage-card { background: rgba(28,25,23,0.9); border: 1px solid rgba(220,167,115,0.3); border-radius: 15px; padding: 15px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
            .offer-status { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 8px; font-weight: bold; text-transform: uppercase; }
            .offer-status.active { background: rgba(16,185,129,0.2); color: #10b981; border: 1px solid #10b981; }
            .offer-status.inactive { background: rgba(239,68,68,0.2); color: #ef4444; border: 1px solid #ef4444; }
            .offer-action-btn { padding: 7px 12px; border-radius: 10px; font-size: 9px; font-weight: bold; cursor: pointer; border: 1px solid; }
            .offer-form-input { width: 100%; background: #0a0908; border: 1px solid rgba(220,167,115,0.3); border-radius: 10px; padding: 12px; color: #fff; margin-top: 5px; font-size: 12px; }
            .offer-form-input::placeholder { color: #57534e; }
        `;
        document.head.appendChild(style);
    }
    
    async loadOffers() {
        try {
            const { data, error } = await supabase
                .from('experiences_offers')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.warn('Supabase error:', error.message);
                this.offers = [];
            } else {
                this.offers = data || [];
            }
        } catch (e) {
            console.warn('Load offers failed:', e.message);
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
            list.innerHTML = '<p style="text-align: center; color: #a8a29e; padding: 30px; font-size: 12px;">No offers found. Click "+ Add New Offer" to create one.</p>';
            return;
        }
        
        list.innerHTML = filtered.map(offer => `
            <div class="offer-manage-card">
                <div style="flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px;">
                    ${offer.image_url ? `
                        <img src="${offer.image_url}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover; flex-shrink: 0;">
                    ` : `
                        <div style="width: 50px; height: 50px; border-radius: 10px; background: rgba(220,167,115,0.1); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
                            🏷️
                        </div>
                    `}
                    <div style="min-width: 0;">
                        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <h3 style="color: #DCA773; font-size: 13px; font-weight: bold; margin: 0;">${offer.title || 'Untitled'}</h3>
                            <span class="offer-status ${offer.is_active ? 'active' : 'inactive'}">${offer.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                        <p style="color: #a8a29e; font-size: 10px; margin: 4px 0 0;">
                            ${offer.venue || 'Unknown'} • ${offer.price || 'N/A'} ${offer.badge ? '• ' + offer.badge : ''}
                        </p>
                    </div>
                </div>
                <div style="display: flex; gap: 6px; flex-shrink: 0;">
                    <button onclick="offersManager.editOffer('${offer.id}')" class="offer-action-btn" style="background: rgba(220,167,115,0.15); color: #DCA773; border-color: #DCA773;">✏️</button>
                    <button onclick="offersManager.toggleActive('${offer.id}')" class="offer-action-btn" style="background: rgba(16,185,129,0.15); color: #10b981; border-color: #10b981;">${offer.is_active ? '⏸' : '▶'}</button>
                    <button onclick="offersManager.deleteOffer('${offer.id}')" class="offer-action-btn" style="background: rgba(239,68,68,0.15); color: #ef4444; border-color: #ef4444;">🗑</button>
                </div>
            </div>
        `).join('');
    }
    
    filterOffers(category) {
        this.currentFilter = category;
        document.querySelectorAll('.offer-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === category) btn.classList.add('active');
        });
        this.renderOffers();
    }
    
    showAddForm() { this.showForm(null); }
    
    editOffer(id) {
        const offer = this.offers.find(o => o.id === id);
        if (offer) this.showForm(offer);
    }
    
    showForm(offer) {
        const isEdit = !!offer;
        const existingForm = document.getElementById('offerFormModal');
        if (existingForm) existingForm.remove();
        
        const formModal = document.createElement('div');
        formModal.id = 'offerFormModal';
        formModal.style.cssText = 'position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.9); padding: 20px;';
        formModal.innerHTML = `
            <div style="background: #1c1917; border: 2px solid #DCA773; border-radius: 20px; padding: 25px; max-width: 500px; width: 100%; max-height: 85vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #DCA773; font-size: 16px; font-weight: bold; margin: 0;">${isEdit ? '✏️ Edit Offer' : '➕ Add New Offer'}</h2>
                    <button onclick="document.getElementById('offerFormModal').remove()" style="background: none; border: none; color: #a8a29e; font-size: 20px; cursor: pointer;">✕</button>
                </div>
                
                <div onclick="document.getElementById('offerImageInput').click()" style="
                    border: 2px dashed #DCA773;
                    border-radius: 1rem;
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    margin-bottom: 15px;
                ">
                    <div id="uploadPlaceholder" style="color: #a8a29e; font-size: 12px;">
                        📁 Click to upload image
                    </div>
                    <img id="offerImagePreview" class="hidden" style="width: 100%; height: 160px; object-fit: cover; border-radius: 12px; margin-top: 10px;">
                </div>
                <input type="file" id="offerImageInput" accept="image/*" class="hidden" onchange="offersManager.handleImageSelect(event)">
                
                <div style="display: grid; gap: 12px;">
                    <input type="text" id="formTitle" class="offer-form-input" value="${offer?.title || ''}" placeholder="Title *">
                    <input type="text" id="formPrice" class="offer-form-input" value="${offer?.price || ''}" placeholder="Price (e.g., AED 75)">
                    <input type="text" id="formVenue" class="offer-form-input" value="${offer?.venue || ''}" placeholder="Venue (e.g., Falaj Restaurant)">
                    <input type="text" id="formBadge" class="offer-form-input" value="${offer?.badge || ''}" placeholder="Badge (e.g., Popular, New, Exclusive)">
                    <textarea id="formDescription" class="offer-form-input" rows="2" placeholder="Short Description">${offer?.description || ''}</textarea>
                    <textarea id="formDetails" class="offer-form-input" rows="3" placeholder="Full Details...">${offer?.details || ''}</textarea>
                    <select id="formCategory" class="offer-form-input">
                        <option value="falaj" ${offer?.category === 'falaj' ? 'selected' : ''}>🍽️ Falaj Restaurant</option>
                        <option value="sarab" ${offer?.category === 'sarab' ? 'selected' : ''}>🍸 Sarab Bar Lounge</option>
                        <option value="alrodah" ${offer?.category === 'alrodah' ? 'selected' : ''}>🕌 Al Rodah</option>
                        <option value="spa" ${offer?.category === 'spa' ? 'selected' : ''}>💆 Spa & Wellness</option>
                    </select>
                </div>
                
                <button onclick="offersManager.saveOffer('${offer?.id || ''}')" style="
                    width: 100%;
                    background: #DCA773;
                    color: #000;
                    border: none;
                    padding: 14px;
                    border-radius: 15px;
                    font-weight: 900;
                    font-size: 12px;
                    cursor: pointer;
                    margin-top: 15px;
                ">${isEdit ? 'Update Offer' : '🚀 Publish Offer'}</button>
            </div>
        `;
        document.body.appendChild(formModal);
        formModal.addEventListener('click', (e) => { if (e.target === formModal) formModal.remove(); });
        
        if (isEdit && offer?.image_url) {
            const preview = document.getElementById('offerImagePreview');
            const placeholder = document.getElementById('uploadPlaceholder');
            if (preview && placeholder) {
                preview.src = offer.image_url;
                preview.classList.remove('hidden');
                placeholder.style.display = 'none';
            }
        }
    }
    
    handleImageSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('offerImagePreview');
            const placeholder = document.getElementById('uploadPlaceholder');
            
            if (preview && placeholder) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                placeholder.style.display = 'none';
            }
            
            window.offerImageData = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    async saveOffer(id) {
        const title = document.getElementById('formTitle').value.trim();
        if (!title) { alert('Title required'); return; }
        
        const payload = {
            title,
            venue: document.getElementById('formVenue').value.trim() || 'Remal Hotel',
            category: document.getElementById('formCategory').value,
            price: document.getElementById('formPrice').value.trim(),
            description: document.getElementById('formDescription').value.trim(),
            details: document.getElementById('formDetails').value.trim(),
            badge: document.getElementById('formBadge').value.trim() || 'Special',
            image_url: window.offerImageData || null,
            is_active: true,
            updated_at: new Date()
        };
        
        try {
            let result;
            if (id) {
                result = await supabase.from('experiences_offers').update(payload).eq('id', id);
            } else {
                result = await supabase.from('experiences_offers').insert(payload);
            }
            
            if (result.error) {
                alert('❌ Error: ' + result.error.message);
                return;
            }
            
            document.getElementById('offerFormModal').remove();
            window.offerImageData = null;
            await this.loadOffers();
            alert('✅ Offer saved!');
        } catch (e) {
            alert('❌ Error: ' + e.message);
        }
    }
    
    async toggleActive(id) {
        const offer = this.offers.find(o => o.id === id);
        if (!offer) return;
        try {
            await supabase.from('experiences_offers').update({ is_active: !offer.is_active }).eq('id', id);
            await this.loadOffers();
        } catch (e) {}
    }
    
    async deleteOffer(id) {
        if (!confirm('Delete this offer?')) return;
        try {
            await supabase.from('experiences_offers').delete().eq('id', id);
            await this.loadOffers();
        } catch (e) {}
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.offersManager = new OffersManager();
});

function showOffersManagement() {
    document.querySelectorAll('.staff-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('navBtnOffers').classList.add('active');
    
    document.getElementById('requestsSection').classList.add('hidden');
    document.getElementById('analyticsSection').classList.add('hidden');
    document.getElementById('offersManagementSection').classList.remove('hidden');
}
