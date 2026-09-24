// ==================================================
// FILE: js/common.js
// VERSION: 1.3.0
// DATE: 2026-09-24
// DEVELOPER: martodosko
// RIDER DISPATCHER — BUONG SISTEMA
// ==================================================

const RIDER_APP = (function () {
    'use strict';

    // === PAGTATAKDA NG SISTEMA ===
    const SUSI_IMBAK = 'rider_dispatcher_data';
    const VERSION = '1.3.0';

    // === ORIHINAL NA DATOS ===
    function orihinalNaDatos() {
        return {
            bersyon: VERSION,
            mga_katakda: {
                presyo_gas_pangkalahatan: 92.00,
                gastos_piyesa_buong_araw: 20.00,
                kodigo_admin: '1234',
                susi_rider: '',
                susi_admin: '',
                // Komisyon bawat ranggo (%)
                kom_baguhan: 0,
                kom_tanso: 3,
                kom_pilak: 5,
                kom_ginto: 7,
                kom_pinakamahusay: 10
            },
            mga_ruta: [
                {
                    id: 'ruta_lopez_calauag',
                    pangalan: 'Lopez → Calauag',
                    pinagmulan: 'Lopez, Quezon',
                    patutunguhan: 'Calauag, Quezon',
                    km_isang_daan: 22.0,
                    litro_biyahe_dalawa: 0.85,
                    presyo_gas_litro: 92.00,
                    gastos_piyesa_biyahe: 5.00,
                    layon_kita_biyahe_dalawa: 300.00,
                    pamasahe_biyahe_dalawa: 150.00
                },
                {
                    id: 'ruta_calauag_sumilang',
                    pangalan: 'Calauag Bayan → Sumilang (BLISS)',
                    pinagmulan: 'Calauag Bayan, Quezon',
                    patutunguhan: 'Sumilang (BLISS), Calauag, Quezon',
                    km_isang_daan: 3.5,
                    litro_biyahe_dalawa: 0.20,
                    presyo_gas_litro: 92.00,
                    gastos_piyesa_biyahe: 2.00,
                    layon_kita_biyahe_dalawa: 80.00,
                    pamasahe_biyahe_dalawa: 50.00
                }
            ],
            mga_rider: [],
            mga_mamimili: [],
            mga_utos: [],
            mga_promosyon: [],
            mga_ulat: [],
            mga_pahina: {},
            mga_pagpapahusay: []
        };
    }

    // === DATOS NG SISTEMA ===
    let datos = orihinalNaDatos();

    // === PAG-IIMBAK AT PAGBASA ===
    function iimbak() {
        try {
            localStorage.setItem(SUSI_IMBAK, JSON.stringify(datos));
            return true;
        } catch (e) {
            console.error('❌ Hindi maiimbak:', e);
            return false;
        }
    }

    function ibalik() {
        const nakuha = localStorage.getItem(SUSI_IMBAK);
        if (!nakuha) {
            datos = orihinalNaDatos();
            return false;
        }
        try {
            datos = JSON.parse(nakuha);
            // Siguraduhing may lahat ng bahagi
            if (!datos.mga_rider) datos.mga_rider = [];
            if (!datos.mga_mamimili) datos.mga_mamimili = [];
            if (!datos.mga_utos) datos.mga_utos = [];
            if (!datos.mga_promosyon) datos.mga_promosyon = [];
            if (!datos.mga_ulat) datos.mga_ulat = [];
            if (!datos.mga_pahina) datos.mga_pahina = {};
            if (!datos.mga_pagpapahusay) datos.mga_pagpapahusay = [];
            if (!datos.mga_katakda) datos.mga_katakda = orihinalNaDatos().mga_katakda;
            if (!datos.mga_ruta) datos.mga_ruta = orihinalNaDatos().mga_ruta;
            // Siguraduhing may porsyento ng komisyon
            const k = datos.mga_katakda;
            if (k.kom_baguhan === undefined) k.kom_baguhan = 0;
            if (k.kom_tanso === undefined) k.kom_tanso = 3;
            if (k.kom_pilak === undefined) k.kom_pilak = 5;
            if (k.kom_ginto === undefined) k.kom_ginto = 7;
            if (k.kom_pinakamahusay === undefined) k.kom_pinakamahusay = 10;
            return true;
        } catch (e) {
            console.error('❌ Mali ang pormat ng datos:', e);
            datos = orihinalNaDatos();
            return false;
        }
    }

    // === PAGPAPAGANDA NG PERA ===
    function pormatPera(halaga) {
        return '₱' + Number(halaga).toFixed(2);
    }

    // ==================================================
    // PAGKALKULA — KITA, GASTOS, PINAKAMABABANG SINGIL
    // ==================================================
    function kalkulahin(ruta) {
        const presyoGas = ruta.presyo_gas_litro || datos.mga_katakda.presyo_gas_pangkalahatan;
        const gastosGas = ruta.litro_biyahe_dalawa * presyoGas;
        const kabuuangGastos = gastosGas + (ruta.gastos_piyesa_biyahe || 0);
        const kita = ruta.pamasahe_biyahe_dalawa - kabuuangGastos;

        const pinakamababangSingil = kabuuangGastos;
        const kailangangSingil = kabuuangGastos + (ruta.layon_kita_biyahe_dalawa || 0);
        const pamasaheIsangDaan = ruta.pamasahe_biyahe_dalawa / 2;
        const mababangIsangDaan = pinakamababangSingil / 2;
        const layongIsangDaan = kailangangSingil / 2;

        return {
            gastos_gas: gastosGas,
            kabuuang_gastos: kabuuangGastos,
            kita: kita,
            pinakamababang_singil: pinakamababangSingil,
            kailangang_singil: kailangangSingil,
            pamasahe_isang_daan: pamasaheIsangDaan,
            mababang_isang_daan: mababangIsangDaan,
            layong_isang_daan: layongIsangDaan,
            lugi: kita < 0
        };
    }

    // ==================================================
    // PAMAMAHALA NG RUTA
    // ==================================================
    function lahatNgRuta() { return datos.mga_ruta || []; }
    function hanapinRuta(id) { return datos.mga_ruta.find(r => r.id === id); }
    function magdagdagRuta(datosRuta) {
        datosRuta.id = 'ruta_' + Date.now();
        datos.mga_ruta.push(datosRuta);
        iimbak();
        return datosRuta.id;
    }
    function baguhinRuta(id, bagongDato) {
        const idx = datos.mga_ruta.findIndex(r => r.id === id);
        if (idx === -1) return false;
        datos.mga_ruta[idx] = { ...datos.mga_ruta[idx], ...bagongDato };
        iimbak();
        return true;
    }
    function burahinRuta(id) {
        datos.mga_ruta = datos.mga_ruta.filter(r => r.id !== id);
        iimbak();
        return true;
    }

    // ==================================================
    // PAMAMAHALA NG RIDER
    // ==================================================
    function lahatNgRider() { return datos.mga_rider || []; }
    function hanapinRider(id) { return datos.mga_rider.find(r => r.id === id); }
    function magdagdagRider(datosRider) {
        datosRider.id = 'rider_' + Date.now();
        if (!datos.mga_rider) datos.mga_rider = [];
        datos.mga_rider.push(datosRider);
        iimbak();
        return datosRider.id;
    }
    function baguhinRider(id, bagongDato) {
        const idx = datos.mga_rider.findIndex(r => r.id === id);
        if (idx === -1) return false;
        datos.mga_rider[idx] = { ...datos.mga_rider[idx], ...bagongDato };
        iimbak();
        return true;
    }
    function burahinRider(id) {
        datos.mga_rider = datos.mga_rider.filter(r => r.id !== id);
        iimbak();
        return true;
    }

    // === RANGGO AT KOMISYON ===
    function kuninRanggoNgRider(riderId) {
        const bilang = (datos.mga_utos || []).filter(u => u.riderId === riderId && u.katayuan === 'tapos').length;
        const k = datos.mga_katakda;
        if (bilang >= 500) return { pangalan: 'Pinakamahusay', antas: 'pinakamahusay', komisyon: k.kom_pinakamahusay };
        if (bilang >= 300) return { pangalan: 'Ginto', antas: 'ginto', komisyon: k.kom_ginto };
        if (bilang >= 150) return { pangalan: 'Pilak', antas: 'pilak', komisyon: k.kom_pilak };
        if (bilang >= 50) return { pangalan: 'Tanso', antas: 'tanso', komisyon: k.kom_tanso };
        return { pangalan: 'Baguhan', antas: 'baguhan', komisyon: k.kom_baguhan };
    }

    // ==================================================
    // PAMAMAHALA NG MAMIMILI
    // ==================================================
    function lahatNgMamimili() { return datos.mga_mamimili || []; }
    function hanapinMamimili(id) { return datos.mga_mamimili.find(m => m.id === id); }
    function magdagdagMamimili(datosMamimili) {
        datosMamimili.id = 'mamimili_' + Date.now();
        if (!datos.mga_mamimili) datos.mga_mamimili = [];
        datos.mga_mamimili.push(datosMamimili);
        iimbak();
        return datosMamimili.id;
    }
    function baguhinMamimili(id, bagongDato) {
        const idx = datos.mga_mamimili.findIndex(m => m.id === id);
        if (idx === -1) return false;
        datos.mga_mamimili[idx] = { ...datos.mga_mamimili[idx], ...bagongDato };
        iimbak();
        return true;
    }
    function burahinMamimili(id) {
        datos.mga_mamimili = datos.mga_mamimili.filter(m => m.id !== id);
        iimbak();
        return true;
    }

    // ==================================================
    // PAMAMAHALA NG UTOS
    // ==================================================
    function lahatNgUtos() { return datos.mga_utos || []; }
    function hanapinUtos(id) { return datos.mga_utos.find(u => u.id === id); }
    function magdagdagUtos(datosUtos) {
        datosUtos.id = 'utos_' + Date.now();
        if (!datos.mga_utos) datos.mga_utos = [];
        datos.mga_utos.push(datosUtos);
        iimbak();
        return datosUtos.id;
    }
    function baguhinUtos(id, bagongDato) {
        const idx = datos.mga_utos.findIndex(u => u.id === id);
        if (idx === -1) return false;
        datos.mga_utos[idx] = { ...datos.mga_utos[idx], ...bagongDato };
        iimbak();
        return true;
    }
    function burahinUtos(id) {
        datos.mga_utos = datos.mga_utos.filter(u => u.id !== id);
        iimbak();
        return true;
    }
    function kabuuanNgKitaSaAraw(petsaIso) {
        return (datos.mga_utos || [])
            .filter(u => u.petsa?.substring(0,10) === petsaIso && u.katayuan === 'tapos')
            .reduce((s,u) => s + (Number(u.halaga) || 0), 0);
    }

    // ==================================================
    // PAMAMAHALA NG PROMOSYON
    // ==================================================
    function lahatNgPromosyon() { return datos.mga_promosyon || []; }
    function hanapinPromosyon(id) { return datos.mga_promosyon.find(p => p.id === id); }
    function magdagdagPromosyon(datosPromo) {
        datosPromo.id = 'promo_' + Date.now();
        if (!datos.mga_promosyon) datos.mga_promosyon = [];
        datos.mga_promosyon.push(datosPromo);
        iimbak();
        return datosPromo.id;
    }
    function baguhinPromosyon(id, bagongDato) {
        const idx = datos.mga_promosyon.findIndex(p => p.id === id);
        if (idx === -1) return false;
        datos.mga_promosyon[idx] = { ...datos.mga_promosyon[idx], ...bagongDato };
        iimbak();
        return true;
    }
    function burahinPromosyon(id) {
        datos.mga_promosyon = datos.mga_promosyon.filter(p => p.id !== id);
        iimbak();
        return true;
    }
    function hanapinPromosyonSaKodigo(kodigo) {
        return datos.mga_promosyon?.find(p => 
            p.kodigo?.toUpperCase() === kodigo.toUpperCase() && 
            p.katayuan === 'aktibo'
        );
    }
    function ilapatPromosyon(pamasahe, promo) {
        if (!promo) return pamasahe;
        const halaga = Number(pamasahe);
        if (promo.pinakamababa && halaga < promo.pinakamababa) return pamasahe;
        if (promo.uri_bawas === 'porsyento') {
            return halaga * (1 - promo.halaga_bawas / 100);
        } else {
            return Math.max(0, halaga - promo.halaga_bawas);
        }
    }

    // ==================================================
    // PAMAMAHALA NG ULAT / SUPORTA
    // ==================================================
    function lahatNgUlat() { return datos.mga_ulat || []; }
    function hanapinUlat(id) { return datos.mga_ulat.find(u => u.id === id); }
    function magdagdagUlat(datosUlat) {
        datosUlat.id = 'ulat_' + Date.now();
        if (!datos.mga_ulat) datos.mga_ulat = [];
        datos.mga_ulat.push(datosUlat);
        iimbak();
        return datosUlat.id;
    }
    function baguhinUlat(id, bagongDato) {
        const idx = datos.mga_ulat.findIndex(u => u.id === id);
        if (idx === -1) return false;
        datos.mga_ulat[idx] = { ...datos.mga_ulat[idx], ...bagongDato };
        iimbak();
        return true;
    }

    // ==================================================
    // PAGPASOK SA ADMIN / SEGURIDAD
    // ==================================================
    function suriinKodigo(kodigo) {
        const inaasahan = datos.mga_katakda.susi_admin || datos.mga_katakda.kodigo_admin;
        return kodigo === inaasahan;
    }
    function suriinSusiRider(susi) {
        return susi && susi === datos.mga_katakda.susi_rider;
    }
    function kuninAntasNgRider(riderId) {
        const rider = hanapinRider(riderId);
        return rider?.antas || 'rider';
    }

    // ==================================================
    // PAGKUHA NG DISTANSYA SA INTERNET (PANSAMANTALA)
    // ==================================================
    async function kumuhaDistansya(mula, papunta) {
        return {
            tagumpay: false,
            mensahe: '🌐 Ang pagkuha sa internet ay nasa paghahanda pa.\nIlagay nang kamay ang kilometro batay sa alam mong distansya.'
        };
    }

    // === SIMULAN ANG SISTEMA ===
    ibalik();

    // === ILABAS SA LABAS ===
    return {
        VERSION,
        SUSI_IMBAK,
        datos,
        orihinalNaDatos,
        iimbak,
        ibalik,
        pormatPera,
        kalkulahin,
        lahatNgRuta,
        hanapinRuta,
        magdagdagRuta,
        baguhinRuta,
        burahinRuta,
        lahatNgRider,
        hanapinRider,
        magdagdagRider,
        baguhinRider,
        burahinRider,
        kuninRanggoNgRider,
        lahatNgMamimili,
        hanapinMamimili,
        magdagdagMamimili,
        baguhinMamimili,
        burahinMamimili,
        lahatNgUtos,
        hanapinUtos,
        magdagdagUtos,
        baguhinUtos,
        burahinUtos,
        kabuuanNgKitaSaAraw,
        lahatNgPromosyon,
        hanapinPromosyon,
        magdagdagPromosyon,
        baguhinPromosyon,
        burahinPromosyon,
        hanapinPromosyonSaKodigo,
        ilapatPromosyon,
        lahatNgUlat,
        hanapinUlat,
        magdagdagUlat,
        baguhinUlat,
        suriinKodigo,
        suriinSusiRider,
        kuninAntasNgRider,
        kumuhaDistansya
    };
})();
