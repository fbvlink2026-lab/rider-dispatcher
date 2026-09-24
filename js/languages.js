// ==================================================
// FILE        : languages.js
// BERSYON     : 1.0.0
// PETSA       : 2026-09-24
// MAY-AKDA    : martodosko
// LUGAR       : rider-dispatcher/js/languages.js
// LAYUNIN     : Talahanayan ng Wika — Tagalog / English
// KONEKSYON   : Lahat ng .html pahina
// DEPENDE     : Wala — purong JavaScript
// ==================================================

(function () {
    'use strict';

    // ---------------- DATABASE NG SALITA ----------------
    const SALITA = {
        tl: {
            // Pangkalahatan
            tahanan: 'Tahanan',
            magpabiyahe: 'Magpa-Biyahe',
            aking_utos: 'Aking mga Utos',
            utos_sa_boses: 'Utos sa Boses',
            promo: 'Promosyon',
            tulong: 'Tulong at Suporta',
            tungkol: 'Tungkol sa Amin',
            admin: 'Admin Panel',
            ipadala: 'Ipadala ang Utos',
            kanselahin: 'Kanselahin',
            i_sa: 'I-save',
            buksan: 'Buksan',
            isara: 'Isara',
            patunay: 'Patunay',
            
            // Biyahe
            mula: 'Mula',
            papuntang: 'Papuntang',
            petsa: 'Petsa',
            oras: 'Oras',
            uri_biyahe: 'Uri ng Biyahe',
            isahan: 'Isahan (1-Way)',
            pabalik: 'Pabalik (2-Way)',
            layo: 'Distansya (km)',
            presyo: 'Presyo',
            kabuuan: 'Kabuuan',
            purong_kita: 'Purong Kita',
            lugi: 'Lugi',
            kumita: 'Kumita',
            
            // Gastos
            gasolina: 'Gasolina',
            presyo_gas: 'Presyo ng Gas / Litro',
            konsumo: 'Konsumo (Litro/km)',
            piyesa: 'Pagpapanatili/Piyesa / Araw',
            upa: 'Upa ng Sasakyan / Araw',
            
            // Katayuan
            nakalaan: 'Nakalaan',
            tinanggap: 'Tinanggap',
            papunta: 'Papunta na',
            nakarating: 'Nakarating na',
            tapos: 'Tapos na',
            kinansela: 'Kinansela',
            
            // Pagbabayad
            paraan_bayad: 'Paraan ng Pagbabayad',
            pera_kamay: 'Pera sa Kamay',
            gcash: 'GCash',
            maya: 'Maya',
            bangko: 'Paglilipat sa Bangko',
            numero_para_bayad: 'Numero para sa Pagbabayad',
            
            // Mensahe
            tagumpay: 'Tagumpay!',
            nabago: 'Matagumpay na nabago.',
            mali: 'May naging mali. Subukan muli.',
            kulang_impormasyon: 'Punan ang lahat ng kinakailangang patlang.',
            kumpirmasyon: 'Kumpirmasyon',
            sigurado_ba: 'Sigurado ka ba?'
        },

        en: {
            // General
            tahanan: 'Home',
            magpabiyahe: 'Book a Ride',
            aking_utos: 'My Orders',
            utos_sa_boses: 'Voice Booking',
            promo: 'Promos',
            tulong: 'Help & Support',
            tungkol: 'About Us',
            admin: 'Admin Panel',
            ipadala: 'Send Order',
            kanselahin: 'Cancel',
            i_sa: 'Save',
            buksan: 'Open',
            isara: 'Close',
            patunay: 'Confirm',
            
            // Trip
            mula: 'From',
            papuntang: 'To',
            petsa: 'Date',
            oras: 'Time',
            uri_biyahe: 'Trip Type',
            isahan: 'One-Way',
            pabalik: 'Round-Trip',
            layo: 'Distance (km)',
            presyo: 'Price',
            kabuuan: 'Total',
            purong_kita: 'Net Income',
            lugi: 'Loss',
            kumita: 'Profit',
            
            // Costs
            gasolina: 'Fuel',
            presyo_gas: 'Fuel Price / Liter',
            konsumo: 'Consumption (Liter/km)',
            piyesa: 'Maintenance / Day',
            upa: 'Vehicle Rent / Day',
            
            // Status
            nakalaan: 'Booked',
            tinanggap: 'Accepted',
            papunta: 'On the Way',
            nakarating: 'Arrived',
            tapos: 'Completed',
            kinansela: 'Cancelled',
            
            // Payment
            paraan_bayad: 'Payment Method',
            pera_kamay: 'Cash',
            gcash: 'GCash',
            maya: 'Maya',
            bangko: 'Bank Transfer',
            numero_para_bayad: 'Payment Number',
            
            // Messages
            tagumpay: 'Success!',
            nabago: 'Saved successfully.',
            mali: 'Something went wrong. Try again.',
            kulang_impormasyon: 'Fill in all required fields.',
            kumpirmasyon: 'Confirmation',
            sigurado_ba: 'Are you sure?'
        }
    };

    // ---------------- PAGTUKOY SA KASALUKUYANG WIKA ----------------
    const WIKA_NAKALA = 'rider_dispatcher_wika';
    let kasalukuyang_wika = localStorage.getItem(WIKA_NAKALA) || 'tl';

    // ---------------- PALITAN ANG WIKA ----------------
    function itakdaWika(code) {
        if (!SALITA[code]) code = 'tl';
        kasalukuyang_wika = code;
        localStorage.setItem(WIKA_NAKALA, code);
        ilapatWika();
        ipagbigayAlaminSaIba();
    }

    function kuninWika() {
        return kasalukuyang_wika;
    }

    function kuninSalita(susi) {
        return SALITA[kasalukuyang_wika][susi] || susi;
    }

    // ---------------- ILAPAT SA BUONG PAHINA ----------------
    function ilapatWika() {
        document.querySelectorAll('[data-wika]').forEach(el => {
            const susi = el.getAttribute('data-wika');
            el.textContent = kuninSalita(susi);
        });
        document.documentElement.lang = kasalukuyang_wika === 'tl' ? 'tl-PH' : 'en';
    }

    // ---------------- ABISO SA IBANG SCRIPT ----------------
    function ipagbigayAlaminSaIba() {
        window.dispatchEvent(new CustomEvent('wkaNagbago', {
            detail: { wika: kasalukuyang_wika }
        }));
    }

    // ---------------- PAGBUKAS NG PAHINA — ILAPAT AGAD ----------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ilapatWika);
    } else {
        ilapatWika();
    }

    // ---------------- ILABAS SA LABAS NG SCRIPT ----------------
    window.RiderWika = {
        itakda: itakdaWika,
        kunin: kuninWika,
        salita: kuninSalita,
        listahan: Object.keys(SALITA)
    };

})();
