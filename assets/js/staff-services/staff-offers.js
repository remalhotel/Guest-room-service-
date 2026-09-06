// ==================== STAFF OFFER MANAGEMENT ====================
function handleOfferImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image too large. Max 5MB.', 'error');
        return;
    }
    
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
                    const preview = document.getElementById('offerImagePreview');
                    const placeholder = document.getElementById('uploadPlaceholder');
                    if (preview && placeholder) {
                        preview.src = ce.target.result;
                        preview.classList.remove('hidden');
                        placeholder.classList.add('hidden');
                    }
                    selectedOfferImage = ce.target.result;
                    showToast('Image compressed and selected!', 'success');
                };
                compressedReader.readAsDataURL(blob);
            }, 'image/jpeg', 0.7);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function publishOffer() {
    const title = document.getElementById('offerTitle')?.value?.trim();
    const price = document.getElementById('offerPrice')?.value?.trim();
    const description = document.getElementById('offerDescription')?.value?.trim();
    const category = document.getElementById('offerCategory')?.value || 'Pool & Beach';
    
    if (!title) { showToast('Please enter a title', 'error'); return; }
    if (!price) { showToast('Please enter a price', 'error'); return; }
    if (!description) { showToast('Please enter a description', 'error'); return; }
    if (!selectedOfferImage) { showToast('Please select an image', 'error'); return; }
    
    const offerData = {
        title: title,
        price: price,
        description: description,
        category: category,
        image: selectedOfferImage,
        is_active: true,
        created_at: new Date().toISOString()
    };
    
    try {
        const { error } = await supabaseClient
            .from('offers')
            .insert([offerData]);
            
        if (error) {
            showToast('Error publishing offer: ' + error.message, 'error');
            return;
        }
        
        showToast('✅ Offer published successfully!', 'success');
        
        document.getElementById('offerTitle').value = '';
        document.getElementById('offerPrice').value = '';
        document.getElementById('offerDescription').value = '';
        document.getElementById('offerCategory').value = 'Pool & Beach';
        selectedOfferImage = null;
        
        const preview = document.getElementById('offerImagePreview');
        const placeholder = document.getElementById('uploadPlaceholder');
        if (preview) preview.classList.add('hidden');
        if (placeholder) placeholder.classList.remove('hidden');
        
        fetchOffers();
        
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

async function fetchOffers() {
    try {
        const { data, error } = await supabaseClient
            .from('offers')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);
            
        if (error) {
            console.warn('Error fetching offers:', error);
            return;
        }
        
        renderOffersList(data || []);
        
    } catch (err) {
        console.warn('Error fetching offers:', err);
    }
}

function renderOffersList(offers) {
    const container = document.getElementById('offersListContainer');
    if (!container) return;
    
    if (!offers || offers.length === 0) {
        container.innerHTML = '<p class="text-center text-muted-custom col-span-full py-8">No offers published yet</p>';
        return;
    }
    
    container.innerHTML = offers.map(offer => `
        <div class="order-card remal-card rounded-2xl overflow-hidden">
            <img src="${offer.image || 'logo.png'}" alt="${offer.title}" class="w-full h-40 object-cover" onerror="this.src='logo.png'">
            <div class="p-4 space-y-2">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold text-[var(--text-gold)] text-xs">${offer.title}</p>
                        <p class="text-[9px] text-muted-custom">${offer.category || 'General'}</p>
                    </div>
                    <span class="font-bold text-[var(--text-gold)] text-sm">${offer.price}</span>
                </div>
                <p class="text-[10px] text-muted-custom">${offer.description || ''}</p>
                <p class="text-[8px] text-muted-custom">Created: ${getTimeAgo(offer.created_at)}</p>
                <div class="flex gap-2 pt-2">
                    <button onclick="toggleOfferActive(${offer.id}, ${!offer.is_active})" class="flex-1 ${offer.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'} py-2 rounded-xl text-xs font-bold transition">
                        ${offer.is_active ? '✅ Active' : '❌ Inactive'}
                    </button>
                    <button onclick="deleteOffer(${offer.id})" class="bg-red-500/10 text-red-400 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-500/30 transition">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function toggleOfferActive(offerId, isActive) {
    try {
        const { error } = await supabaseClient
            .from('offers')
            .update({ is_active: isActive })
            .eq('id', offerId);
            
        if (error) {
            showToast('Error: ' + error.message, 'error');
            return;
        }
        
        showToast(`Offer ${isActive ? 'activated' : 'deactivated'}`, 'success');
        fetchOffers();
        
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

async function deleteOffer(offerId) {
    if (!confirm('Delete this offer?')) return;
    
    try {
        const { error } = await supabaseClient
            .from('offers')
            .delete()
            .eq('id', offerId);
            
        if (error) {
            showToast('Error: ' + error.message, 'error');
            return;
        }
        
        showToast('Offer deleted', 'info');
        fetchOffers();
        
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}
