function setup() {
    initCanvas();
    renderUi();
    setDefaults();
}

function draw() {
    renderCalculation();
}
/*
    Расчет траектории
**/
function calculateTrajectory(trajectoryNum) {
    const increment = getSetting('CALCULATION.angleIncrement');
    const result = [];
    const { p, epsilon } = getTrajectoryParams(trajectoryNum);

    for(let ang = 0; ang <= (Math.PI * 2) + increment; ang += increment) {
        const r = p / (1 + (epsilon * Math.cos(ang)));
        result.push([r, ang])
    }

    return result;
}

/*
    Расчет параметров траектории
**/
function getTrajectoryParams(trajectoryNum) {
    const epsilon = Number(document.getElementById(`e-${trajectoryNum}`).value) || getSetting(`CALCULATION.epsilon.${trajectoryNum}`);
    const p = getSetting(`CALCULATION.p.${trajectoryNum}`);

    return { p, epsilon };
}

/*
    Возведение в квадрат
**/
function sqr(num) {
    return Math.pow(num, 2);
}
/*
    Корень квадратный
**/
function sqrt(num) {
    return Math.pow(num, 0.5);
}
/*
    Установка параметров по умолчанию
**/
function setDefaults() {
    for(let inputNum = 0; inputNum < getSetting('UI.inputNum'); inputNum++) {
        document.getElementById(`e-${inputNum}`).value = getSetting(`CALCULATION.epsilon.${inputNum}`);
    }
}

function renderCalculation() {
    clear();
    drawCoordinateSystem();

    for(let inputNum = 0; inputNum < getSetting('UI.inputNum'); inputNum++) {
        drawTrajectory(inputNum, calculateTrajectory(inputNum));
    }
}

function renderUi() {
    if (!getSetting('UI.autoUpdate')) {
        noLoop();
    } else {
        loop();
    }
    displayInputs();
    displayCalculateButton();
    displayScaleButtons();
}
