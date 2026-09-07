// ==================== STAFF OFFERS ====================
function handleOfferImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Image too large', 'error'); return; }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxWidth = 800;
            const ratio = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * ratio;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(function(blob) {
                const compressedReader = new FileReader();
                compressedReader.onload = function(ce) {
                    document.getElementById('offerImagePreview').src = ce.target.result;
                    document.getElementById('offerImagePreview').classList.remove('hidden');
                    document.getElementById('uploadPlaceholder').classList.add('hidden');
                    selectedOfferImage = ce.target.result;
                    showToast('✅ Image selected!', 'success');
                };
                compressedReader.readAsDataURL(blob);
            }, 'image/jpeg', 0.7);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function publishOffer() {
    const title = document.getElementById('offerTitle').value.trim();
    const price = document.getElementById('offerPrice').value.trim();
    const description = document.getElementById('offerDescription').value.trim();
    const category = document.getElementById('offerCategory').value;
    
    if (!title || !price || !description || !selectedOfferImage) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    const offerData = { title, price, description, category, image: selectedOfferImage, is_active: true, created_at: new Date().toISOString() };
    
    const { error } = await supabaseClient.from('offers').insert([offerData]);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
    
    showToast('✅ Offer published!', 'success');
    document.getElementById('offerTitle').value = '';
    document.getElementById('offerPrice').value = '';
    document.getElementById('offerDescription').value = '';
    selectedOfferImage = null;
    document.getElementById('offerImagePreview').classList.add('hidden');
    document.getElementById('uploadPlaceholder').classList.remove('hidden');
    fetchOffers();
}

async function fetchOffers() {
    const { data } = await supabaseClient.from('offers').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) renderOffersList(data);
}

function renderOffersList(offers) {
    const container = document.getElementById('offersListContainer');
    if (!offers || !offers.length) {
        container.innerHTML = '<p class="text-center text-stone-400 col-span-full py-8">No offers yet</p>';
        return;
    }
    container.innerHTML = offers.map(offer => `
        <div class="remal-card rounded-2xl overflow-hidden">
            <img src="${offer.image}" alt="${offer.title}" class="w-full h-40 object-cover" onerror="this.src='logo.png'">
            <div class="p-4 space-y-2">
                <div class="flex justify-between">
                    <div><p class="font-bold text-[var(--text-gold)] text-xs">${offer.title}</p><p class="text-[9px] text-stone-400">${offer.category}</p></div>
                    <span class="font-bold text-[var(--text-gold)] text-sm">${offer.price}</span>
                </div>
                <p class="text-[10px] text-stone-400">${offer.description}</p>
                <div class="flex gap-2">
                    <button onclick="toggleOfferActive(${offer.id}, ${!offer.is_active})" class="flex-1 ${offer.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'} py-2 rounded-xl text-xs font-bold">${offer.is_active ? '✅ Active' : '❌ Inactive'}</button>
                    <button onclick="deleteOffer(${offer.id})" class="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl text-xs">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function toggleOfferActive(offerId, isActive) {
    await supabaseClient.from('offers').update({ is_active: isActive }).eq('id', offerId);
    showToast(isActive ? '✅ Activated' : '❌ Deactivated', 'success');
    fetchOffers();
}

async function deleteOffer(offerId) {
    if (!confirm('Delete this offer?')) return;
    await supabaseClient.from('offers').delete().eq('id', offerId);
    showToast('🗑️ Deleted', 'info');
    fetchOffers();
}

window.handleOfferImageSelect = handleOfferImageSelect;
window.publishOffer = publishOffer;
window.fetchOffers = fetchOffers;
window.renderOffersList = renderOffersList;
window.toggleOfferActive = toggleOfferActive;
window.deleteOffer = deleteOffer;
