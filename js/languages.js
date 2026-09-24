// ==================================================
// FILE        : languages.js
// BERSYON     : 2.0.0 — Kumpleto para sa lahat ng pahina
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
            // ============= PANGKALAHATAN =============
            tahanan: 'Tahanan',
            magpabiyahe: 'Magpa-Biyahe',
            aking_utos: 'Aking mga Utos',
            aking_biyahe: 'Aking mga Biyahe',
            utos_sa_boses: 'Utos sa Boses',
            promo: 'Promosyon',
            promosyon: 'Promosyon',
            presyo: 'Presyo',
            tulong: 'Tulong at Suporta',
            tulong_gabay: 'Tulong at Gabay',
            tungkol: 'Tungkol sa Amin',
            admin: 'Admin Panel',
            admin_panel: 'Admin Panel',
            para_sa_tsuper: 'Para sa Tsuper',
            ipadala: 'Ipadala ang Utos',
            ipadala_utos: 'Ipadala ang Utos',
            kanselahin: 'Kanselahin',
            kanselahin_utos: 'Kanselahin ang Utos',
            i_sa: 'I-save',
            iligtas: '💾 Iligtas',
            buksan: 'Buksan',
            isara: 'Isara',
            patunay: 'Patunay',
            oo: 'Oo',
            hindi: 'Hindi',
            sigurado_ka: 'Sigurado ka ba?',
            sigurado_ba: 'Sigurado ka ba?',
            sigurado_kansela: 'Sigurado ka bang kanselahin ang utos?',
            walang_data: 'Wala pang nakatakda.',
            libre_para_lahat: 'Libre para sa lahat',
            paglilingkod: 'Pamasahe at Pagpapabiyahe',
            piliin_wika: 'Piliin ang Wika',

            // ============= BIYAHE / BOOKING =============
            mula: 'Mula',
            papuntang: 'Papuntang',
            petsa: 'Petsa',
            oras: 'Oras',
            uri_biyahe: 'Uri ng Biyahe',
            isahan: 'Isahan (1-Way)',
            pabalik: 'Pabalik (2-Way)',
            layo: 'Distansya (km)',
            distansya: 'Distansya',
            pinakamababang_singil: 'Pinakamababang Singil',
            inaasahang_presyo: 'Inaasahang Presyo',
            kodigo_promo: 'Kodigo ng Alok',
            gamitin: 'Gamitin',
            pangalan: 'Buong Pangalan',
            telepono: 'Numero ng Telepono',
            paunawa: 'Karagdagang Paunawa',
            kabuuan: 'Kabuuan',
            kabuuang_bayad: 'Kabuuang Babayaran',
            purong_kita: 'Purong Kita',
            lugi: 'Lugi',
            kumita: 'Kumita',
            magpabiyahe_ngayon: 'Magpa-Biyahe Ngayon',
            gumawa_muna_utos: 'Gumawa muna ng utos sa pahina ng Pag-order',

            // ============= GASTOS =============
            gasolina: 'Gasolina',
            presyo_gas: 'Presyo ng Gas / Litro',
            konsumo: 'Konsumo (Litro/km)',
            piyesa: 'Pagpapanatili/Piyesa / Araw',
            upa: 'Upa ng Sasakyan / Araw',

            // ============= KATAYUAN / STATUS =============
            nakalaan: 'Nakalaan',
            hinihintay: 'Hinihintay',
            hinihintay_admin: 'Naghihintay sa Admin...',
            tinanggap: 'Tinanggap',
            tinanggap_naghahanap_tsuper: 'Tinanggap — naghahanap ng tsuper',
            nakatakda: 'Nakatakda Na',
            papunta: 'Papunta na',
            may_tsuper_na_papunta: 'May tsuper na — papunta sa iyo',
            nasa_biyahe_na: 'Nasa biyahe na patungo sa patutunguhan',
            nakarating: 'Nakarating na',
            nakarating_na: 'Nakarating na!',
            tapos: 'Tapos Na',
            tapos_na_salamat: 'Tapos na — Salamat!',
            kinansela: 'Kinansela',
            kanselado: 'Kinansela',
            nakansela_na: 'Nakansela na',
            walang_aktibong_biyahe: 'Walang Aktibong Biyahe',

            // ============= PAGBABAYAD =============
            paraan_bayad: 'Paraan ng Pagbabayad',
            pera_kamay: 'Pera sa Kamay',
            gcash: 'GCash',
            maya: 'Maya',
            bangko: 'Paglilipat sa Bangko',
            numero_para_bayad: 'Numero para sa Pagbabayad',
            bayad_kable: 'Bayad sa Pamamagitan ng Kable / Banko',
            numero_ng_utosh: 'Numero ng Utos',
            kabuuang_bayad: 'Kabuuang Babayaran',

            // ============= SUBAYBAY / TRACKING =============
            subaybayan: 'Subaybayan',
            subaybayan_ang_biyahe: 'Subaybayan ang Biyahe',
            tsuper: 'Tsuper',
            kukunin: 'Kukunin',
            kukunin_lok: '📍 Kukunin',
            patutunguhan: 'Patutunguhan',
            patutunguhan_lok: '🏁 Patutunguhan',
            detalye_ng_biyahe: 'Detalye ng Biyahe',
            inilagay: '🕐 Inilagay',
            tantsang_pagdating: 'Tantsang Pagdating',
            papunta_sa_iyo: 'papunta sa iyo',
            minuto: 'minuto',
            impormasyon_ng_tsuper: 'Impormasyon ng Tsuper',
            sasakyan: 'Sasakyan',
            kontak: 'Kontak',
            hindi_nakalagay: 'Hindi nakalagay',
            wala_pang_nakalagay: 'Wala pang nakalagay',
            tawagan_tsuper: 'Tawagan ang Tsuper',
            huling_pagsusuri: 'Huling pagsusuri',
            sinusuri: 'Sinusuri...',
            lokasyon_ng_tsuper: 'Lokasyon ng Tsuper',
            sinusubaybayan_gps: 'Sinusubaybayan ang signal ng GPS...',
            hinihintay: 'Hinihintay...',
            nakansela_na: 'Nakansela na ang utos.',

            // ============= Boses =============
            pindutin_magsalita: 'Pindutin at sabihin ang iyong utos',
            nagrerekord: '🔴 Nagrerekord… Magsalita ka ngayon',
            nakatala_na: 'Nakatala na — handa nang ipadala',
            ulitin: '🗑️ Ulitin',
            ipadala_boses: '✅ Ipadala ang Utos',
            walang_naipadala: 'Wala pang naipadala.',

            // ============= Suporta =============
            qr_scan: 'I-scan para sa Pagbukas ng Site',
            kopyahin_link: 'Kopyahin ang Link',
            magpadala_tiket: 'Magpadala ng Tiket — 24 Oras / 7 Araw',
            sagot_sa: 'Sasagot kami sa loob ng 24 oras.',

            // ============= MENSAHE =============
            tagumpay: 'Tagumpay!',
            matagumpay: 'Matagumpay!',
            natanggap_utos: 'Natanggap na ang iyong pagpapabiyahe.',
            nabago: 'Matagumpay na nabago.',
            mali: 'May naging mali. Subukan muli.',
            kulang_impormasyon: 'Punan ang lahat ng kinakailangang patlang.',
            kumpirmasyon: 'Kumpirmasyon'
        },

        en: {
            // ============= GENERAL =============
            tahanan: 'Home',
            magpabiyahe: 'Book a Ride',
            aking_utos: 'My Orders',
            aking_biyahe: 'My Rides',
            utos_sa_boses: 'Voice Booking',
            promo: 'Promos',
            promosyon: 'Promos',
            presyo: 'Fare',
            tulong: 'Help & Support',
            tulong_gabay: 'Help & Guide',
            tungkol: 'About Us',
            admin: 'Admin Panel',
            admin_panel: 'Admin Panel',
            para_sa_tsuper: 'For Riders',
            ipadala: 'Send Order',
            ipadala_utos: 'Submit Booking',
            kanselahin: 'Cancel',
            kanselahin_utos: 'Cancel Booking',
            i_sa: 'Save',
            iligtas: '💾 Save',
            buksan: 'Open',
            isara: 'Close',
            patunay: 'Confirm',
            oo: 'Yes',
            hindi: 'No',
            sigurado_ka: 'Are you sure?',
            sigurado_ba: 'Are you sure?',
            sigurado_kansela: 'Are you sure you want to cancel?',
            walang_data: 'Not set yet.',
            libre_para_lahat: 'Free for Everyone',
            paglilingkod: 'Fare & Booking Service',
            piliin_wika: 'Select Language',

            // ============= TRIP / BOOKING =============
            mula: 'From',
            papuntang: 'To',
            petsa: 'Date',
            oras: 'Time',
            uri_biyahe: 'Trip Type',
            isahan: 'One-Way',
            pabalik: 'Round-Trip',
            layo: 'Distance (km)',
            distansya: 'Distance',
            pinakamababang_singil: 'Minimum Fare',
            inaasahang_presyo: 'Estimated Price',
            kodigo_promo: 'Promo Code',
            gamitin: 'Apply',
            pangalan: 'Full Name',
            telepono: 'Phone Number',
            paunawa: 'Additional Notes',
            kabuuan: 'Total',
            kabuuang_bayad: 'Total Amount',
            purong_kita: 'Net Income',
            lugi: 'Loss',
            kumita: 'Profit',
            magpabiyahe_ngayon: 'Book a Ride Now',
            gumawa_muna_utos: 'Create a booking first on the Home page',

            // ============= COSTS =============
            gasolina: 'Fuel',
            presyo_gas: 'Fuel Price / Liter',
            konsumo: 'Consumption (Liter/km)',
            piyesa: 'Maintenance / Day',
            upa: 'Vehicle Rent / Day',

            // ============= STATUS =============
            nakalaan: 'Booked',
            hinihintay: 'Pending',
            hinihintay_admin: 'Waiting for Admin...',
            tinanggap: 'Accepted',
            tinanggap_naghahanap_tsuper: 'Accepted — finding a rider',
            nakatakda: 'Scheduled',
            papunta: 'On the Way',
            may_tsuper_na_papunta: 'Rider assigned — heading your way',
            nasa_biyahe_na: 'On the way to destination',
            nakarating: 'Arrived',
            nakarating_na: 'Arrived!',
            tapos: 'Completed',
            tapos_na_salamat: 'Completed — Thank you!',
            kinansela: 'Cancelled',
            kanselado: 'Cancelled',
            nakansela_na: 'Cancelled',
            walang_aktibong_biyahe: 'No Active Ride',

            // ============= PAYMENT =============
            paraan_bayad: 'Payment Method',
            pera_kamay: 'Cash',
            gcash: 'GCash',
            maya: 'Maya',
            bangko: 'Bank Transfer',
            numero_para_bayad: 'Payment Number',
            bayad_kable: 'Wire / Bank Transfer Payment',
            numero_ng_utosh: 'Order Number',
            kabuuang_bayad: 'Total Amount',

            // ============= TRACKING =============
            subaybayan: 'Track Ride',
            subaybayan_ang_biyahe: 'Track Your Ride',
            tsuper: 'Rider',
            kukunin: 'Pickup',
            kukunin_lok: '📍 Pickup',
            patutunguhan: 'Destination',
            patutunguhan_lok: '🏁 Destination',
            detalye_ng_biyahe: 'Trip Details',
            inilagay: 'Booked',
            tantsang_pagdating: 'Estimated Arrival',
            papunta_sa_iyo: 'away from you',
            minuto: 'min',
            impormasyon_ng_tsuper: 'Rider Info',
            sasakyan: 'Vehicle',
            kontak: 'Contact',
            hindi_nakalagay: 'Not provided',
            wala_pang_nakalagay: 'Not provided yet',
            tawagan_tsuper: 'Call Rider',
            huling_pagsusuri: 'Last checked',
            sinusuri: 'Checking...',
            lokasyon_ng_tsuper: 'Rider Location',
            sinusubaybayan_gps: 'Tracking GPS signal...',
            hinihintay: 'Waiting...',
            nakansela_na: 'Booking cancelled.',

            // ============= VOICE =============
            pindutin_magsalita: 'Tap and speak your booking request',
            nagrerekord: '🔴 Recording… Speak now',
            nakatala_na: 'Recorded — ready to submit',
            ulitin: '🗑️ Retry',
            ipadala_boses: '✅ Send Order',
            walang_naipadala: 'No orders yet.',

            // ============= SUPPORT =============
            qr_scan: 'Scan to Open Site',
            kopyahin_link: 'Copy Link',
            magpadala_tiket: 'Submit Ticket — 24/7 Support',
            sagot_sa: 'We will respond within 24 hours.',

            // ============= MESSAGES =============
            tagumpay: 'Success!',
            matagumpay: 'Success!',
            natanggap_utos: 'Your booking has been received.',
            nabago: 'Saved successfully.',
            mali: 'Something went wrong. Try again.',
            kulang_impormasyon: 'Fill in all required fields.',
            kumpirmasyon: 'Confirmation'
        }
    };

    // ---------------- KASALUKUYANG WIKA ----------------
    const SUSI_IMBAK = 'rider_dispatcher_wika';
    let kasalukuyang_wika = localStorage.getItem(SUSI_IMBAK) || 'tl';

    // ---------------- KUNIN ANG SALITA ----------------
    function __(susi) {
        return SALITA[kasalukuyang_wika]?.[susi] || SALITA['tl'][susi] || susi;
    }

    // ---------------- PALITAN ANG WIKA ----------------
    function itakdaWika(bagongWika) {
        if (!SALITA[bagongWika]) bagongWika = 'tl';
        kasalukuyang_wika = bagongWika;
        localStorage.setItem(SUSI_IMBAK, bagongWika);
        ilapatWika();
        ipagbigayAlaminSaIba();
    }

    function kuninWika() {
        return kasalukuyang_wika;
    }

    // ---------------- ILAPAT SA BUONG PAHINA ----------------
    function ilapatWika() {
        // Teksto
        document.querySelectorAll('[data-wika]').forEach(el => {
            const susi = el.getAttribute('data-wika');
            el.textContent = __(susi);
        });
        // Placeholder
        document.querySelectorAll('[data-wika-lugar]').forEach(el => {
            const susi = el.getAttribute('data-wika-lugar');
            el.placeholder = __(susi);
        });
        // Pamagat / Title
        document.querySelectorAll('[data-wika-pamagat]').forEach(el => {
            const susi = el.getAttribute('data-wika-pamagat');
            el.setAttribute('title', __(susi));
        });
        // html lang attribute
        document.documentElement.lang = kasalukuyang_wika === 'tl' ? 'tl-PH' : 'en';
    }

    // ---------------- ABISO SA IBANG SCRIPT ----------------
    function ipagbigayAlaminSaIba() {
        window.dispatchEvent(new CustomEvent('wkaNagbago', {
            detail: { wika: kasalukuyang_wika }
        }));
    }

    // ---------------- PAGBUKAS NG PAHINA ----------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ilapatWika);
    } else {
        ilapatWika();
    }

    // ---------------- ILABAS SA LABAS ----------------
    window.__ = __;
    window.RiderWika = {
        itakda: itakdaWika,
        kunin: kuninWika,
        salita: __,
        listahan: Object.keys(SALITA)
    };

})();
