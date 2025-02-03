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
    }
    else if (coeffs.length === 3) {
        // Equação de segundo grau: ax² + bx + c = 0
        let a = coeffs[0], b = coeffs[1], c = coeffs[2];
        let delta = b * b - 4 * a * c;

        if (delta < 0) {
            // Raízes complexas
            let realPart = -b / (2 * a);
            let imagPart = Math.sqrt(-delta) / (2 * a);
            return [realPart + " + " + imagPart + "i", realPart + " - " + imagPart + "i"];
        }
        else {
            return [(-b + Math.sqrt(delta)) / (2 * a), (-b - Math.sqrt(delta)) / (2 * a)];
        }
    }
    else {
        alert("Somente equações de primeiro e segundo grau são suportadas.");
        return [];
    }
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

    let roots = solvePolynomial(den);
    if (roots.length === 0) {
        alert("Erro: Nenhuma raiz encontrada. Verifique os coeficientes.");
        return;
    }

    let real = [], imag = [];
    roots.forEach(root => {
        if (typeof root === "string") {
            // Raízes complexas
            let parts = root.split(" ");
            real.push(parseFloat(parts[0]));
            imag.push(parseFloat(parts[2]));
        } else {
            // Raízes reais
            real.push(root);
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
