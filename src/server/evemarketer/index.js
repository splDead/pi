const rp = require('request-promise');

module.exports = systemId => {
    const options = {
        method: 'POST',
        url: 'https://api.evemarketer.com/ec/marketstat/json?typeid=2393,2396,3779,2401,2390,2397,2392,3683,2389,2399,2395,2398,9828,2400,3645,2329,3828,9836,9832,44,3693,15317,3725,3689,2327,9842,2463,2317,2321,3695,9830,3697,9838,2312,3691,2319,9840,3775,2328,2358,2345,2344,2367,17392,2348,9834,2366,2361,17898,2360,2354,2352,9846,9848,2351,2349,2346,12836,17136,28974,2867,2868,2869,2870,2871,2872,2875,2876',
        json: true
    };

    if (systemId) {
        options.url += `&usesystem=${systemId}`;
    }

    return rp(options);
};
