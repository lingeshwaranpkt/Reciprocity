// script.js - CORRECTED FOR RECIPROCITY THEOREM
const R = 1000; // All resistors = 1kΩ

// Theoretical: R_aa = R_bb = 2 kΩ
function calculateTheoretical(V) {
    const Ia = V / (2 * R); // V / 2000Ω = Ia in Amps
    const current_mA = Ia * 1000;
    const resistance_kOhm = 2.0; // Always 2 kΩ
    return { current: current_mA, resistance: resistance_kOhm };
}

// Practical: Add 1% tolerance
function calculatePractical(V) {
    const tol = 0.01;
    const R1 = R * (1 + (Math.random() - 0.5) * tol * 2);
    const R2 = R * (1 + (Math.random() - 0.5) * tol * 2);
    const R3 = R * (1 + (Math.random() - 0.5) * tol * 2);
    const R4 = R * (1 + (Math.random() - 0.5) * tol * 2);
    const R5 = R * (1 + (Math.random() - 0.5) * tol * 2); // middle

    // Equivalent: (R1+R2) || (R3+R4) + R5
    const left = R1 + R2;
    const right = R3 + R4;
    const parallel = (left * right) / (left + right);
    const total = parallel + R5;

    const I_source = V / total;
    const I_middle = I_source; // all current flows through middle
    const current_mA = I_middle * 1000;
    const resistance_kOhm = V / I_middle / 1000;

    return { current: current_mA, resistance: resistance_kOhm };
}

// Update Circuit 1
function updateCircuit1() {
    const V = parseFloat(document.getElementById('va-slider').value);
    document.getElementById('va-value').textContent = V.toFixed(1);
    document.getElementById('va-display').textContent = V.toFixed(1);

    const theo = calculateTheoretical(V);
    const prac = calculatePractical(V);

    document.getElementById('ia-theo').textContent = theo.current.toFixed(1);
    document.getElementById('ia-prac').textContent = prac.current.toFixed(1);
    document.getElementById('raa-theo').textContent = theo.resistance.toFixed(1);
    document.getElementById('raa-prac').textContent = prac.resistance.toFixed(1);

    drawCircuit1(V, prac.current);
    updateVerification();
}

// Update Circuit 2
function updateCircuit2() {
    const V = parseFloat(document.getElementById('vb-slider').value);
    document.getElementById('vb-value').textContent = V.toFixed(1);
    document.getElementById('vb-display').textContent = V.toFixed(1);

    const theo = calculateTheoretical(V);
    const prac = calculatePractical(V);

    document.getElementById('ib-theo').textContent = theo.current.toFixed(1);
    document.getElementById('ib-prac').textContent = prac.current.toFixed(1);
    document.getElementById('rbb-theo').textContent = theo.resistance.toFixed(1);
    document.getElementById('rbb-prac').textContent = prac.resistance.toFixed(1);

    drawCircuit2(V, prac.current);
    updateVerification();
}

// Draw Circuit 1 (Va on left)
function drawCircuit1(Va, Ia) {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 400, 200);

    const cx = 200, cy = 100;
    const w = 60, h = 40;

    // Top: 1kΩ -- 1kΩ -- 1kΩ
    drawResistor(ctx, 80, 60, w, 0);   // Left top
    drawResistor(ctx, 200, 60, w, 0);  // Middle top
    drawResistor(ctx, 320, 60, w, 0);  // Right top

    // Bottom: 1kΩ -- 1kΩ
    drawResistor(ctx, 80, 140, w, 0);
    drawResistor(ctx, 320, 140, w, 0);

    // Vertical middle (Ia)
    ctx.beginPath();
    ctx.moveTo(200, 100);
    ctx.lineTo(200, 140);
    ctx.stroke();
    drawAmmeter(ctx, 200, 120, Ia.toFixed(1));

    // Va source (left)
    ctx.fillStyle = '#d00';
    ctx.fillRect(20, 80, 15, 40);
    ctx.fillStyle = '#000';
    ctx.fillText(`+${Va.toFixed(1)}V`, 5, 95);
    ctx.fillText('-', 25, 115);

    // Labels
    ctx.fillText('1kΩ', 95, 55);
    ctx.fillText('1kΩ (Ia)', 195, 55);
    ctx.fillText('1kΩ', 335, 55);
    ctx.fillText('1kΩ', 95, 155);
    ctx.fillText('1kΩ', 335, 155);
}

// Draw Circuit 2 (Vb on right)
function drawCircuit2(Vb, Ib) {
    const canvas = document.getElementById('canvas2');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 400, 200);

    const cx = 200, cy = 100;
    const w = 60, h = 40;

    drawResistor(ctx, 80, 60, w, 0);
    drawResistor(ctx, 200, 60, w, 0);
    drawResistor(ctx, 320, 60, w, 0);
    drawResistor(ctx, 80, 140, w, 0);
    drawResistor(ctx, 320, 140, w, 0);

    ctx.beginPath();
    ctx.moveTo(200, 100);
    ctx.lineTo(200, 140);
    ctx.stroke();
    drawAmmeter(ctx, 200, 120, Ib.toFixed(1));

    // Vb on right
    ctx.fillStyle = '#d00';
    ctx.fillRect(365, 80, 15, 40);
    ctx.fillStyle = '#000';
    ctx.fillText(`+${Vb.toFixed(1)}V`, 350, 95);
    ctx.fillText('-', 370, 115);

    ctx.fillText('1kΩ', 95, 55);
    ctx.fillText('1kΩ', 195, 55);
    ctx.fillText('1kΩ (Ib)', 315, 55);
    ctx.fillText('1kΩ', 95, 155);
    ctx.fillText('1kΩ', 335, 155);
}

// Helper: Draw resistor
function drawResistor(ctx, x, y, w, dir) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 0; i < 6; i++) {
        const dx = (i % 2 === 0) ? w/6 : -w/6;
        ctx.lineTo(x + dx, y);
        x += dx;
    }
    ctx.lineTo(x + w/6, y);
    ctx.stroke();
}

// Helper: Draw ammeter
function drawAmmeter(ctx, x, y, value) {
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillText(value + 'mA', x - 18, y + 5);
}

// Tab switch
function switchTab(tabName) {
    document.querySelectorAll('.tab-content, .tab-button').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Verification
function updateVerification() {
    const va = parseFloat(document.getElementById('va-slider').value);
    const vb = parseFloat(document.getElementById('vb-slider').value);
    const raa = parseFloat(document.getElementById('raa-prac').textContent) || 0;
    const rbb = parseFloat(document.getElementById('rbb-prac').textContent) || 0;

    if (Math.abs(va - vb) < 0.1) {
        const diff = Math.abs(raa - rbb);
        const msg = diff < 0.1
            ? `Reciprocity verified! R_aa (${raa.toFixed(2)}) ≈ R_bb (${rbb.toFixed(2)}) kΩ`
            : `Close! R_aa = ${raa.toFixed(2)}, R_bb = ${rbb.toFixed(2)} kΩ (diff: ${diff.toFixed(2)})`;
        document.getElementById('recip-check').innerHTML = `<strong>${msg}</strong>`;
    } else {
        document.getElementById('recip-check').textContent = 'Set Va = Vb to verify reciprocity.';
    }
}

// Init
document.getElementById('va-slider').addEventListener('input', updateCircuit1);
document.getElementById('vb-slider').addEventListener('input', updateCircuit2);
updateCircuit1();
updateCircuit2();
