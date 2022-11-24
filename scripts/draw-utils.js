/*
    ----------    Функции отрисовки траектории     --------------
**/

/*
    Рендерит траекторию
**/
function drawTrajectory(trajectoryNum, coordinatesTable) {
    if (!(coordinatesTable && coordinatesTable.length && coordinatesTable.length > 1)) {
        return;
    }

    strokeWeight(getSetting('TRAJECTORY.lineWidth'))
    stroke(getSetting('UI.colors')[trajectoryNum]);

    const scale = getSetting('CALCULATION.scale');

    for(let i = 1; i < coordinatesTable.length; i++) {
        const [prevDist, prevRadians] = coordinatesTable[i - 1];
        const [currDist, currRadians] = coordinatesTable[i];
        polar( line, prevDist * scale, prevRadians, currDist * scale, currRadians);
    }
}
/*
    Рендерит координатную систему
**/
function drawCoordinateSystem() {
    strokeWeight(getSetting('CANVAS.lineWidth'))
    background(getSetting('CANVAS.backgroundColor'));
    noFill();
    const axisLength = getAxisLength();

    stroke(getSetting('CANVAS.axisSecondaryColor'));
    for(let fi = 0; fi < Math.PI; fi += (Math.PI / (getSetting('CANVAS.axisNum') * getSetting('CANVAS.axisSubdivisions')))) {
        polar( line, axisLength, fi, axisLength, fi + Math.PI)
    }
    for(let r = 0; r < axisLength * 2; r += axisLength * 2 / (getSetting('CANVAS.axisNum') * getSetting('CANVAS.axisSubdivisions'))) {
        circle( getSetting('CANVAS.width') / 2, getSetting('CANVAS.height') / 2, r)
    }
    stroke(getSetting('CANVAS.axisPrimaryColor'));
    for(let fi = 0; fi < Math.PI; fi += (Math.PI / getSetting('CANVAS.axisNum'))) {
        polar( line, axisLength, fi, axisLength, fi + Math.PI)
    }
    for(let r = 0; r < axisLength * 2; r += axisLength * 2 / getSetting('CANVAS.axisNum')) {
        circle( getSetting('CANVAS.width') / 2, getSetting('CANVAS.height') / 2, r)
    }
}

function initCanvas() {
    createCanvas(getSetting('CANVAS.width'), getSetting('CANVAS.height'));
}
/*
    Вызывает функции из p5.js в полярных координатах
**/
function polar(fn, ...args) {
    let newArgs = [];
    for(let i = 0; i < args.length; i += 2) {
        const { x, y } = polar2Cartesian(args[i], args[i + 1]);
        newArgs = [...newArgs, x, y];
    }
    return fn.apply(this, newArgs);
}
/*
    Переводит декартовы в полярные
**/
function cartesian2Polar(xCoord, yCoord) {
    const x = xCoord - (getSetting('CANVAS.width') / 2);
    const y = yCoord - (getSetting('CANVAS.height') / 2);
    const distance = Math.sqrt(x * x + y * y);
    const radians = Math.atan2(y, x);
    return { distance, radians };
}
/*
    Переводит полярные в декартовы
**/
function polar2Cartesian(distance, radians) {
    const x = (distance * Math.cos(radians)) + (getSetting('CANVAS.width') / 2);
    const y = (distance * Math.sin(radians)) + (getSetting('CANVAS.height') / 2);
    return { x, y };
}

function getAxisLength() {
    return Math.max(getSetting('CANVAS.width'), getSetting('CANVAS.height'));
}

/*
    ----------    Функции отрисовки интерфейса     --------------
**/

function displayInputs() {
    const inputMetadata = getSetting('UI.inputMetadata');
    const inputContainers = [];
    for (let inputNum = 0; inputNum < getSetting('UI.inputNum'); inputNum++) {
        const container = document.createElement('div');
        container.classList.add('padding-md', 'input-container');
        container.style.borderLeft = `5px solid ${getSetting('UI.colors')[inputNum]}`;
        inputMetadata.forEach(metadata => {
            const label = document.createElement('label');
            label.classList.add('description', 'padding-sm');
            label.innerText = metadata.label;
            const input = document.createElement('input');
            input.classList.add('number-input', 'padding-md', 'round-border');
            input.id = `${metadata.key}-${inputNum}`;
            input.type = 'number';
            input.step = metadata.step;
            container.appendChild(label);
            container.appendChild(input);
        });
        inputContainers.push(container);
    }
    document.getElementById('main-settings').replaceChildren(...inputContainers);
}

function displayScaleButtons() {
    const container = document.getElementById('scale-container');
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('scale-button-container');

    const plusButton = document.createElement('button');
    plusButton.classList.add('padding-md', 'round-border', 'scale-button');
    plusButton.innerText = '+';

    const minusButton = document.createElement('button');
    minusButton.classList.add('padding-md', 'round-border', 'scale-button');
    minusButton.innerText = '-';

    minusButton.addEventListener('click', () => setSetting('CALCULATION.scale', getSetting('CALCULATION.scale') / getSetting('CALCULATION.scaleIncrement')));
    plusButton.addEventListener('click', () => setSetting('CALCULATION.scale', getSetting('CALCULATION.scale') * getSetting('CALCULATION.scaleIncrement')));

    buttonContainer.appendChild(minusButton);
    buttonContainer.appendChild(plusButton);
    container.appendChild(buttonContainer);
}

function displayCalculateButton() {
    const calculateButtonId = 'calculate-button';
    const existingButton = document.getElementById(calculateButtonId);
    if(!getSetting('UI.autoUpdate')) {
        if (!existingButton) {
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('padding-sm');
            const calculateButton = document.createElement('button');
            calculateButton.classList.add('padding-md', 'round-border');
            calculateButton.id = calculateButtonId;
            calculateButton.innerText = 'Рассчитать';
            calculateButton.addEventListener('click', () => renderCalculation());
            buttonContainer.appendChild(calculateButton);
            document.getElementById('header-container').appendChild(buttonContainer)
        }
    } else {
        document.getElementById(calculateButtonId)?.remove();
    }
}
