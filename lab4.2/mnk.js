function leastSquares(points, degree) {
    const n = degree + 1;

    let A = Array.from({ length: n }, () => Array(n).fill(0));
    let B = Array(n).fill(0);

    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            A[row][col] = points.reduce((sum, p) => sum + Math.pow(p.x, row + col), 0);
        }

        B[row] = points.reduce((sum, p) => sum + p.y * Math.pow(p.x, row), 0);
    }

    let coeffs = gaussianElimination(A, B);

    return function(x) {
        return coeffs.reduce((sum, c, i) => sum + c * Math.pow(x, i), 0);
    };
}

function gaussianElimination(A, B) {
    const n = B.length;

    for (let i = 0; i < n; i++) {
        let maxRow = i;

        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                maxRow = k;
            }
        }

        [A[i], A[maxRow]] = [A[maxRow], A[i]];
        [B[i], B[maxRow]] = [B[maxRow], B[i]];

        for (let k = i + 1; k < n; k++) {
            let factor = A[k][i] / A[i][i];

            for (let j = i; j < n; j++) {
                A[k][j] -= factor * A[i][j];
            }

            B[k] -= factor * B[i];
        }
    }

    let x = Array(n).fill(0);

    for (let i = n - 1; i >= 0; i--) {
        x[i] = B[i];

        for (let j = i + 1; j < n; j++) {
            x[i] -= A[i][j] * x[j];
        }

        x[i] /= A[i][i];
    }

    return x;
}
