function lagrangeInterpolation(points, x) {
    let result = 0;

    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                term *= (x - points[j].x) / (points[i].x - points[j].x);
            }
        }

        result += term;
    }

    return result;
}
