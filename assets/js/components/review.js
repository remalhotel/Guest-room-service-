// ==================== SYSTÈME D'AVIS DE SÉJOUR ====================
let reviewStars = 0;
let reviewCategories = {};

function showReviewModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/90 z-[950] flex items-center justify-center p-4 backdrop-blur-sm';
    modal.id = 'reviewModal';
    
    modal.innerHTML = `
        <div class="bg-stone-900 border border-amber-500/30 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b border-stone-800 pb-3">
                <h3 class="text-xs font-serif-luxury font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-widest">
                    ⭐ Review Your Stay
                </h3>
                <button onclick="closeReviewModal()" class="text-stone-400 hover:text-stone-100 text-xl font-bold">✕</button>
            </div>
            
            <div class="space-y-4">
                <!-- Note globale -->
                <div class="text-center">
                    <p class="text-[10px] text-stone-400 font-bold uppercase mb-2">Overall Experience</p>
                    <div class="flex justify-center gap-2" id="reviewStarsContainer">
                        ${[1, 2, 3, 4, 5].map(star => `
                            <button onclick="selectReviewStar(${star})" class="review-star-btn text-4xl hover:scale-125 transition text-stone-600" data-star="${star}">
                                ★
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Catégories -->
                <div class="space-y-3">
                    <p class="text-[10px] text-stone-400 font-bold uppercase text-center">Rate Each Category</p>
                    
                    ${getCategoryRatings()}
                </div>
                
                <!-- Commentaire -->
                <div>
                    <p class="text-[10px] text-stone-400 font-bold uppercase mb-2">Your Comments</p>
                    <textarea id="reviewComment" placeholder="Tell us about your stay..." class="w-full h-24 bg-stone-950 border border-stone-800 rounded-2xl p-3 outline-none resize-none text-xs text-stone-200"></textarea>
                </div>
                
                <!-- Recommandation -->
                <div class="flex gap-2">
                    <button onclick="setRecommendation('yes')" id="recYes" class="flex-1 bg-stone-800 hover:bg-emerald-500/20 text-stone-200 hover:text-emerald-400 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest transition border border-transparent hover:border-emerald-500/30">
                        👍 Yes
                    </button>
                    <button onclick="setRecommendation('no')" id="recNo" class="flex-1 bg-stone-800 hover:bg-red-500/20 text-stone-200 hover:text-red-400 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest transition border border-transparent hover:border-red-500/30">
                        👎 No
                    </button>
                </div>
                
                <button onclick="submitReview()" class="w-full bg-[#DCA773] hover:bg-[#ebd0b3] text-stone-950 font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition">
                    Submit Review
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function getCategoryRatings() {
    const categories = [
        { id: 'cleanliness', label: '🧹 Cleanliness' },
        { id: 'comfort', label: '🛏️ Comfort' },
        { id: 'service', label: '🛎️ Service' },
        { id: 'food', label: '🍽️ Food Quality' },
        { id: 'location', label: '📍 Location' },
        { id: 'value', label: '💰 Value for Money' }
    ];
    
    return categories.map(cat => `
        <div>
            <p class="text-[9px] text-stone-400 font-bold mb-1">${cat.label}</p>
            <div class="flex gap-1" id="cat-${cat.id}">
                ${[1, 2, 3, 4, 5].map(star => `
                    <button onclick="selectCategoryStar('${cat.id}', ${star})" class="cat-star-btn text-2xl hover:scale-125 transition text-stone-600" data-cat="${cat.id}" data-star="${star}">
                        ★
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function selectReviewStar(star) {
    reviewStars = star;
    document.querySelectorAll('.review-star-btn').forEach(btn => {
        const btnStar = parseInt(btn.getAttribute('data-star'));
        if (btnStar <= star) {
            btn.className = 'review-star-btn text-4xl hover:scale-125 transition text-amber-400';
        } else {
            btn.className = 'review-star-btn text-4xl hover:scale-125 transition text-stone-600';
        }
    });
}

function selectCategoryStar(category, star) {
    reviewCategories[category] = star;
    document.querySelectorAll(`.cat-star-btn[data-cat="${category}"]`).forEach(btn => {
        const btnStar = parseInt(btn.getAttribute('data-star'));
        if (btnStar <= star) {
            btn.className = `cat-star-btn text-2xl hover:scale-125 transition text-amber-400`;
        } else {
            btn.className = `cat-star-btn text-2xl hover:scale-125 transition text-stone-600`;
        }
    });
}

let wouldRecommend = null;

function setRecommendation(value) {
    wouldRecommend = value;
    const btnYes = document.getElementById('recYes');
    const btnNo = document.getElementById('recNo');
    
    if (value === 'yes') {
        btnYes.className = 'flex-1 bg-emerald-500/20 text-emerald-400 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest transition border border-emerald-500/30';
        btnNo.className = 'flex-1 bg-stone-800 text-stone-200 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest transition border border-transparent';
    } else {
        btnNo.className = 'flex-1 bg-red-500/20 text-red-400 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest transition border border-red-500/30';
        btnYes.className = 'flex-1 bg-stone-800 text-stone-200 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest transition border border-transparent';
    }
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) modal.remove();
    resetReviewState();
}

function resetReviewState() {
    reviewStars = 0;
    reviewCategories = {};
    wouldRecommend = null;
}

async function submitReview() {
    if (!reviewStars) {
        showToast('Please give an overall rating', 'error');
        return;
    }
    
    const comment = document.getElementById('reviewComment')?.value?.trim() || '';
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    
    const reviewData = {
        room_number: String(room),
        guest_name: cachedGuestData?.guest_name || 'Guest',
        overall_rating: reviewStars,
        cleanliness_rating: reviewCategories.cleanliness || 0,
        comfort_rating: reviewCategories.comfort || 0,
        service_rating: reviewCategories.service || 0,
        food_rating: reviewCategories.food || 0,
        location_rating: reviewCategories.location || 0,
        value_rating: reviewCategories.value || 0,
        review_text: comment,
        would_recommend: wouldRecommend === 'yes',
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabaseClient) {
            const { error } = await supabaseClient
                .from('stay_reviews')
                .insert([reviewData]);
                
            if (error) {
                console.warn('Error saving review:', error);
                showToast('Error saving review', 'error');
                return;
            }
        }
        
        closeReviewModal();
        showToast('Thank you for your review! 🌟', 'success');
        
    } catch (err) {
        console.warn('Error saving review:', err);
        showToast('Error saving review', 'error');
    }
}

function initReviewSystem() {
    // Vérifier si le client a déjà laissé un avis
    const room = cachedGuestData?.room || localStorage.getItem('remal_guest_room');
    const reviewKey = `review_submitted_${room}`;
    
    if (!localStorage.getItem(reviewKey) && room) {
        // Afficher le bouton d'avis dans la page principale
        renderReviewButton();
    }
}

function renderReviewButton() {
    const container = document.getElementById('reviewButtonContainer');
    if (!container) return;
    
    container.innerHTML = `
        <button onclick="showReviewModal()" class="w-full p-3 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl hover:border-amber-500/50 transition">
            <div class="flex items-center justify-center gap-2">
                <span class="text-2xl">⭐</span>
                <div class="text-left">
                    <p class="text-[10px] font-bold text-[var(--text-gold,#DCA773)] uppercase tracking-wider">Review Your Stay</p>
                    <p class="text-[8px] text-stone-400">Share your experience with us</p>
                </div>
            </div>
        </button>
    `;
}
