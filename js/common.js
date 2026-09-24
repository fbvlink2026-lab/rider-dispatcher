// ==================================================
// FILE        : common.js
// BERSYON     : 1.0.0
// PETSA       : 2026-09-24
// MAY-AKDA    : martodosko
// LUGAR       : rider-dispatcher/js/common.js
// LAYUNIN     : Datos, Imbak, Pagkalkula, I-Import/I-Export
// KONEKSYON   : Lahat ng pahina
// DEPENDE     : languages.js
// ==================================================

(function () {
    'use strict';

    // ---------------- PANGALAN NG IMBAK SA BROWSER ----------------
    const SUSI_IMBAK = 'rider_dispatcher_datos';

    // ---------------- PUNDASYON NG DATOS ----------------
    const DATOS_PAUNANG = {
        mga_ruta: [
            { id: 'r1', mula: 'Lopez, Quezon', papuntang: 'Calauag, Quezon', layo_km: 22.0, uri: 'pareho' },
            { id: 'r2', mula: 'Calauag Bayan', papuntang: 'Sumilang (BLISS), Calauag', layo_km: 3.2, uri: 'pareho' },
            { id: 'r3', mula: 'Lopez, Quezon', papuntang: 'Gumaca, Quezon', layo_km: 18.0, uri: 'pareho' }
        ],
        mga_biyahe: [],
        pagtatakda: {
            presyo_gas: 92.00,
            konsumo_litro_km: 0.0425, // 0.85L ÷ 20km
            piyesa_araw: 20.00,
            upa_sasakyan_araw: 0.00,
            layunin_kita: 300.00,
            sasakyan: 'Habal-Habal / Motorsiklo',
            sasakyan_custom: ''
        },
        mga_sasakyan: [
            { pangalan: 'Habal-Habal / Motorsiklo', konsumo: 0.0425, tala: 'Karaniwang motorsiklo' },
            { pangalan: 'Tricycle', konsumo: 0.065, tala: 'May sidecar' },
            { pangalan: 'Jeep', konsumo: 0.12, tala: 'Pampasaherong jeep' },
            { pangalan: 'Kotse', konsumo: 0.08, tala: 'Pribadong sasakyan' },
            { pangalan: 'Custom', konsumo: 0.00, tala: 'Sariling pagtatakda' }
        ],
        admin: {
            susi: '',
            naka_log: false
        },
        impormasyon_kontak: {
            gcash: '',
            maya: '',
            bangko: '',
            numero: ''
        }
    };

    // ---------------- BASAHIN ANG IMBAK ----------------
    function kuninDato() {
        const nakaimbak = localStorage.getItem(SUSI_IMBAK);
        if (!nakaimbak) {
            ibigayDato(DATOS_PAUNANG);
            return JSON.parse(JSON.stringify(DATOS_PAUNANG));
        }
        try {
            const datos = JSON.parse(nakaimbak);
            // Tiyaking kumpleto ang lahat ng bahagi
            return pagsamahinDato(datos);
        } catch (e) {
            console.warn('Nasira ang nakaimbak na datos — ibinalik sa paunang halaga');
            ibigayDato(DATOS_PAUNANG);
            return JSON.parse(JSON.stringify(DATOS_PAUNANG));
        }
    }

    function pagsamahinDato(datos) {
        const buo = JSON.parse(JSON.stringify(DATOS_PAUNANG));
        for (const susi in datos) {
            if (datos.hasOwnProperty(susi) && datos[susi] !== undefined) {
                if (typeof datos[susi] === 'object' && !Array.isArray(datos[susi])) {
                    buo[susi] = { ...buo[susi], ...datos[susi] };
                } else {
                    buo[susi] = datos[susi];
                }
            }
        }
        return buo;
    }

    function ibigayDato(datos) {
        localStorage.setItem(SUSI_IMBAK, JSON.stringify(datos));
        ipagbigayAlaminSaIba();
    }

    // ---------------- PAGKALKULA NG HALAGA ----------------
    function kwentahinBiyahe(layo_km, uri_biyahe = 'isahan') {
        const datos = kuninDato();
        const takda = datos.pagtatakda;

        // Sukat ng layo
        const kabuuan_km = uri_biyahe === 'pabalik' ? layo_km * 2 : layo_km;

        // Gastos sa gasolina
        const gastos_gas = kabuuan_km * takda.konsumo_litro_km * takda.presyo_gas;

        // Hatian sa gastos pang-araw
        const bilang_biyahe = datos.mga_biyahe.length || 1;
        const hatian_piyesa = takda.piyesa_araw / bilang_biyahe;
        const hatian_upa = takda.upa_sasakyan_araw / bilang_biyahe;

        // Kabuuang gastos
        const kabuuan_gastos = gastos_gas + hatian_piyesa + hatian_upa;

        // Inirerekomendang pamasahe — hindi lugi + bahagi ng layunin
        const bahagi_layunin = takda.layunin_kita / bilang_biyahe;
        const inirerekomenda = kabuuan_gastos + bahagi_layunin;

        return {
            layo_km: kabuuan_km,
            gastos_gas: parseFloat(gastos_gas.toFixed(2)),
            hatian_piyesa: parseFloat(hatian_piyesa.toFixed(2)),
            hatian_upa: parseFloat(hatian_upa.toFixed(2)),
            kabuuan_gastos: parseFloat(kabuuan_gastos.toFixed(2)),
            inirerekomenda: parseFloat(inirerekomenda.toFixed(2)),
            uri_biyahe,
            para_isahan: parseFloat((inirerekomenda / (uri_biyahe === 'pabalik' ? 2 : 1)).toFixed(2))
        };
    }

    // ---------------- PAGTALA NG BAGONG BIYAHE ----------------
    function italaBiyahe(datos_biyahe) {
        const datos = kuninDato();
        const biyahe = {
            id: 'b' + Date.now(),
            oras_itala: new Date().toISOString(),
            mula: datos_biyahe.mula,
            papuntang: datos_biyahe.papuntang,
            layo_km: datos_biyahe.layo_km,
            uri_biyahe: datos_biyahe.uri_biyahe || 'isahan',
            pamasahe: datos_biyahe.pamasahe,
            kwenta: kwentahinBiyahe(datos_biyahe.layo_km, datos_biyahe.uri_biyahe),
            katayuan: datos_biyahe.katayuan || 'nakalaan',
            paraan_pagbabayad: datos_biyahe.paraan_pagbabayad || ''
        };

        datos.mga_biyahe.unshift(biyahe);
        ibigayDato(datos);
        return biyahe;
    }

    function burahinBiyahe(id) {
        const datos = kuninDato();
        dati.mga_biyahe = datos.mga_biyahe.filter(b => b.id !== id);
        ibigayDato(datos);
    }

    function baguhinKatayuan(id, bagong_katayuan) {
        const datos = kuninDato();
        const biyahe = datos.mga_biyahe.find(b => b.id === id);
        if (biyahe) {
            biyahe.katayuan = bagong_katayuan;
            ibigayDato(datos);
        }
    }

    // ---------------- KABUUANG KITA AT GASTOS ----------------
    function kuninBuod() {
        const datos = kuninDato();
        const natapos = datos.mga_biyahe.filter(b => b.katayuan === 'tapos');

        const kabuuan_pasok = natapos.reduce((sum, b) => sum + (b.pamasahe || 0), 0);
        const kabuuan_gastos = natapos.reduce((sum, b) => sum + (b.kwenta?.kabuuan_gastos || 0), 0);
        const purong_kita = kabuuan_pasok - kabuuan_gastos;

        return {
            bilang_biyahe: natapos.length,
            kabuuan_pasok: parseFloat(kabuuan_pasok.toFixed(2)),
            kabuuan_gastos: parseFloat(kabuuan_gastos.toFixed(2)),
            purong_kita: parseFloat(purong_kita.toFixed(2)),
            layunin_natamo: datos.pagtatakda.layunin_kita > 0
                ? Math.min(100, Math.round((purong_kita / datos.pagtatakda.layunin_kita) * 100))
                : 0
        };
    }

    // ---------------- I-EXPORT AT I-IMPORT ----------------
    function iExporta() {
        const datos = kuninDato();
        const teksto = JSON.stringify(datos, null, 2);
        const blob = new Blob([teksto], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `rider-dispatcher-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        return true;
    }

    async function iImporta(file) {
        try {
            const teksto = await file.text();
            const datos = JSON.parse(teksto);
            ibigayDato(pagsamahinDato(datos));
            return { tagumpay: true };
        } catch (e) {
            return { tagumpay: false, mali: e.message };
        }
    }

    // ---------------- PALITAN ANG SASAKYAN ----------------
    function kuninKonsumoNgSasakyan(pangalan) {
        const datos = kuninDato();
        const sasakyan = datos.mga_sasakyan.find(s => s.pangalan === pangalan);
        if (!sasakyan) return 0.0425;
        if (sasakyan.pangalan === 'Custom') {
            return datos.pagtatakda.konsumo_litro_km;
        }
        return sasakyan.konsumo;
    }

    // ---------------- ABISO SA IBANG SCRIPT ----------------
    function ipagbigayAlaminSaIba() {
        window.dispatchEvent(new CustomEvent('datoNagbago'));
    }

    // ---------------- ILABAS SA LABAS ----------------
    window.RiderDato = {
        kunin: kuninDato,
        ibigay: ibigayDato,
        kwenta: kwentahinBiyahe,
        itala: italaBiyahe,
        burahin: burahinBiyahe,
        katayuan: baguhinKatayuan,
        buod: kuninBuod,
        iExporta,
        iImporta,
        konsumoSasakyan: kuninKonsumoNgSasakyan,
        paunang: DATOS_PAUNANG
    };

})();
