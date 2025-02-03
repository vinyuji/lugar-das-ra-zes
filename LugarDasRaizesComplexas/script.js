function addCoef(containerId) {
    let container = document.getElementById(containerId);
    let input = document.createElement("input");
    input.type = "number";
    input.placeholder = "Coef";
    container.appendChild(input);
}

function solvePolynomial(coeffs) {
    if (coeffs.length === 2) {
        // Equação de primeiro grau: ax + b = 0 -> x = -b/a
        return [-coeffs[1] / coeffs[0]];
    } else if (coeffs.length === 3) {
        // Equação de segundo grau: ax² + bx + c = 0
        let a = coeffs[0], b = coeffs[1], c = coeffs[2];
        let delta = b * b - 4 * a * c;

        if (delta < 0) {
            // Raízes complexas
            let realPart = -b / (2 * a);
            let imagPart = Math.sqrt(-delta) / (2 * a);
            return [realPart + " + " + imagPart + "i", realPart + " - " + imagPart + "i"];
        } else {
            return [(-b + Math.sqrt(delta)) / (2 * a), (-b - Math.sqrt(delta)) / (2 * a)];
        }
    } else {
        alert("Somente equações de primeiro e segundo grau são suportadas.");
        return [];
    }
}

// Função para calcular o critério de Routh-Hurwitz
function routhHurwitz(den) {
    let rows = [];
    rows.push(den.slice()); // Primeira linha (coeficientes do denominador)

    // Preenche a segunda linha da tabela de Routh
    let secondRow = [];
    for (let i = 0; i < rows[0].length - 1; i += 2) {
        secondRow.push(rows[0][i]);
    }
    rows.push(secondRow);

    // Continua calculando as linhas seguintes até que a última linha tenha 1 ou 0 elementos
    while (rows[rows.length - 1].length > 1) {
        let newRow = [];
        for (let i = 0; i < rows[rows.length - 1].length - 1; i++) {
            let numerator = rows[rows.length - 2][0] * rows[rows.length - 1][i + 1] - rows[rows.length - 2][1] * rows[rows.length - 1][i];
            let denominator = rows[rows.length - 2][0] - rows[rows.length - 1][i + 1];
            newRow.push(numerator / denominator);
        }
        rows.push(newRow);
    }

    // Verificando a estabilidade com o critério de Routh-Hurwitz
    let signChanges = 0;
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[i].length; j++) {
            if (rows[i][j] < 0) {
                signChanges++;
            }
        }
    }

    return signChanges;
}

function plotRootLocus() {
    let numInputs = document.querySelectorAll("#num-container input");
    let denInputs = document.querySelectorAll("#den-container input");

    let num = Array.from(numInputs).map(input => parseFloat(input.value)).filter(val => !isNaN(val));
    let den = Array.from(denInputs).map(input => parseFloat(input.value)).filter(val => !isNaN(val));

    if (num.length === 0 || den.length === 0) {
        alert("Insira coeficientes válidos para o numerador e denominador.");
        return;
    }

    // Exibe a equação montada
    let equation = `Função de Transferência: G(s) = (${num.join('s+')} ) / (${den.join('s')})`;
    document.getElementById('equation').innerText = equation;

    // Calculando polos e zeros
    let poles = solvePolynomial(den);
    let zeros = solvePolynomial(num);

    // Exibe polos e zeros
    document.getElementById('poles-zeros').innerText = `Polos: ${poles.join(', ')}\nZeros: ${zeros.join(', ')}`;

    // Aplicando o critério de Routh-Hurwitz
    let signChanges = routhHurwitz(den);
    let stability = signChanges === 0 ? "Estável" : "Instável";
    document.getElementById('stability').innerText = `Critério de Routh-Hurwitz: Sistema ${stability}`;

    // Plotando o Lugar das Raízes
    let real = [], imag = [];
    poles.forEach(pole => {
        if (typeof pole === "string") {
            // Raízes complexas
            let parts = pole.split(" ");
            real.push(parseFloat(parts[0]));
            imag.push(parseFloat(parts[2]));
        } else {
            // Raízes reais
            real.push(pole);
            imag.push(0);
        }
    });

    let trace = {
        x: real,
        y: imag,
        mode: 'markers',
        marker: { size: 10, color: 'red' },
        type: 'scatter'
    };

    let layout = {
        title: "Lugar das Raízes",
        xaxis: { title: "Eixo Real", zeroline: true },
        yaxis: { title: "Eixo Imaginário", zeroline: true },
        paper_bgcolor: '#121212',
        plot_bgcolor: '#121212',
        font: { color: 'white' }
    };

    Plotly.newPlot("plot", [trace], layout);
}
