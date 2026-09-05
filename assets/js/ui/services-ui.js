// ==================== SERVICES UI ====================
function renderServiceFields(fields) {
    const container = document.getElementById('otherServiceFields');
    container.innerHTML = fields.map(field => {
        if (field.type === 'select') {
            return `<div><label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label><select id="${field.id}" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold cursor-pointer text-xs text-stone-200">${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}</select></div>`;
        } else if (field.type === 'date') {
            const today = new Date().toISOString().split('T')[0];
            return `<div><label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label><input type="date" id="${field.id}" value="${today}" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold text-xs text-stone-200"></div>`;
        } else if (field.type === 'time') {
            return `<div><label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label><input type="time" id="${field.id}" value="19:30" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold text-xs text-stone-200"></div>`;
        } else if (field.type === 'number') {
            return `<div><label class="block font-bold text-[var(--text-gold,#DCA773)] mb-1.5 uppercase tracking-wider text-[10px]">${field.label}</label><input type="number" id="${field.id}" min="1" max="10" value="1" class="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 font-bold text-xs text-stone-200"></div>`;
        }
        return '';
    }).join('');
}
