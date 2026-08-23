const generateTelemetry = (panelId) => {
    const hour = new Date().getHours();

    const sunlightFactor = Math.max(
        0,
        Math.sin(((hour - 6) / 12) * Math.PI)
    );

    const irradiance = Math.round(
        1000 * sunlightFactor + Math.random() * 80
    );

    const temperature = Number(
        (20 + sunlightFactor * 20 + Math.random() * 5).toFixed(1)
    );

    const efficiency = Number(
        (15 + sunlightFactor * 7 + Math.random() * 2).toFixed(2)
    );

    const power = Number(
        ((irradiance / 1000) * efficiency * 10).toFixed(2)
    );

    return {
        panelId,
        irradiance,
        temperature,
        efficiency,
        power,
        voltage: Number((350 + Math.random() * 30).toFixed(2)),
        current: Number((8 + Math.random() * 4).toFixed(2)),
        status: "Online",
        timestamp: new Date()
    };
};

module.exports = { generateTelemetry };