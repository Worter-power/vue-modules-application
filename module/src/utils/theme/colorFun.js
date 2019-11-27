export default (theme)=>{
    if(/^#/i.test(theme)){
        theme = theme.slice(1);
    }
    if(/^rgb/i.test(theme)){
        theme = '457cd6'
    }
    const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);
        red += Math.round(tint * (255 - red));
        green += Math.round(tint * (255 - green));
        blue += Math.round(tint * (255 - blue));

        red = red.toString(16);
        green = green.toString(16);
        blue = blue.toString(16);

        return `#${ red }${ green }${ blue }`;
    };

    const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        red = Math.round((1 - shade) * red);
        green = Math.round((1 - shade) * green);
        blue = Math.round((1 - shade) * blue);

        red = red.toString(16);
        green = green.toString(16);
        blue = blue.toString(16);

        return `#${ red }${ green }${ blue }`;
    };

    const clusters = {};
    for (let i = 0; i <= 9; i++) {
        clusters['primary'+i] = tintColor( theme, Number((i / 10).toFixed(2)));
    }
    clusters['primary10'] = shadeColor(theme, 0.1);
    return clusters;
}