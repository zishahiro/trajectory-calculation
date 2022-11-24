/*
    Настройки
**/
const SETTINGS = {
    CANVAS: {
        width: 1000,
        height: 800,
        backgroundColor: '#f8f8f8',
        axisPrimaryColor: '#aaaaaa',
        axisSecondaryColor: '#e5e5e5',
        axisNum: 6,
        axisSubdivisions: 5,
        lineWidth: 1,
    },

    TRAJECTORY: {
        lineWidth: 3,
    },

    UI: {
        autoUpdate: true,
        inputNum: 3,
        colors: ['red', 'green', 'blue', 'violet', 'orange', 'brown', 'tomato', 'slategrey', 'lime', 'mediumturquoise'],
        inputMetadata: [
            {
                key: 'e',
                label: 'Эксцентриситет',
                step: 0.01,
            },
        ]
    },

    CALCULATION: {
        angleIncrement: 0.05,
        scale: 0.000000002,
        scaleIncrement: 1.5,
        epsilonDefault: 0.017,
        p0: 130312028083,
        p1: 173894348787,
        p2: 98245645645,
    }
}

function getSetting(path) {
    return path.split('.').reduce((acc, key) => acc[key], SETTINGS);
}

function setSetting(path, value) {
    const props = path.split('.');
    props.reduce((acc, key, i, arr) => {
        if(i === arr.length - 1) {
            acc[key] = value;
        }
        return acc[key]
    }, SETTINGS);

    updateSettingSideEffect(props[0]);
}

function updateSettingSideEffect(updateKey) {
    if(updateKey === 'UI') {
        renderUi();
    } else if(!getSetting('UI.autoUpdate')) {
        renderCalculation();
    }
}
