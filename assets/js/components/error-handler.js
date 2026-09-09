// ==================== ERROR HANDLER ====================
// Gestion élégante des erreurs
// N'affecte AUCUNE fonctionnalité existante

(function() {
    'use strict';
    
    console.log('🛡️ Error Handler activé');
    
    function showError(message, type = 'error') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            background: ${type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(28, 25, 23, 0.95)'};
            color: white;
            padding: 14px 20px;
            border-radius: 14px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            animation: errorIn 0.4s ease;
            max-width: 300px;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transition = 'all 0.3s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
    
    function injectStyles() {
        if (document.getElementById('errorHandlerStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'errorHandlerStyles';
        style.textContent = `
            @keyframes errorIn {
                from { opacity: 0; transform: translateX(100px); }
                to { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Gérer les erreurs globales
    window.addEventListener('error', (event) => {
        console.error('Erreur globale:', event.error);
        showError('⚠️ Une erreur est survenue. Veuillez réessayer.');
    });
    
    // Gérer les erreurs de promesse
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promesse rejetée:', event.reason);
        showError('⚠️ Erreur de connexion. Vérifiez votre connexion.');
    });
    
    // Gérer les erreurs Supabase
    function handleSupabaseError(error) {
        console.error('Erreur Supabase:', error);
        
        if (error.message.includes('network')) {
            showError('📡 Problème de connexion. Mode hors ligne.');
        } else if (error.message.includes('permission')) {
            showError('🔒 Accès refusé.');
        } else if (error.message.includes('duplicate')) {
            showError('📋 Donnée déjà existante.');
        } else {
            showError('⚠️ ' + error.message);
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
    });
    
    // Exposer
    window.showError = showError;
    window.handleSupabaseError = handleSupabaseError;
    
})();
