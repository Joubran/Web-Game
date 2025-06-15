export function calculateOptimalSolution(columns) {
    const height = Math.max(...columns);
    const width = columns.length;
    let bestSolution = {
        total: 0,
        matrix: Array.from({ length: height }, () => new Array(width).fill(0))
    };

    function backtrack(startCol, currentTotal, currentMatrix) {
        if (startCol >= width - 1) {
            if (currentTotal > bestSolution.total) {
                bestSolution = {
                    total: currentTotal,
                    matrix: currentMatrix.map(row => [...row])
                };
            }
            return;
        }

        // Вариант 1: Пропускаем текущую колонку
        backtrack(startCol + 1, currentTotal, currentMatrix);

        // Вариант 2: Пробуем разместить контейнеры в текущей паре
        const maxPossible = Math.min(columns[startCol], columns[startCol + 1]);
        let actuallyPlaced = 0;
        const newMatrix = currentMatrix.map(row => [...row]);

        for (let level = 0; level < maxPossible; level++) {
            if (newMatrix[level][startCol] === 0 && newMatrix[level][startCol + 1] === 0) {
                newMatrix[level][startCol] = 1;
                newMatrix[level][startCol + 1] = 1;
                actuallyPlaced++;
            } else {
                break; // Нельзя разместить выше, если уровень занят
            }
        }

        if (actuallyPlaced > 0) {
            backtrack(startCol + 2, currentTotal + actuallyPlaced, newMatrix);
        }
    }

    backtrack(0, 0, Array.from({ length: height }, () => new Array(width).fill(0)));

    return {
        totalContainers: bestSolution.total,
        solutionMatrix: bestSolution.matrix
    };
}



// Тест 2
const test2 = [3,6,5,5];
const result2 = calculateOptimalSolution(test2);
console.log("Test 2 [3,6,5,5]:", result2.totalContainers); // 8
console.log("Матрица:");
result2.solutionMatrix.forEach(row => console.log(row.join('')));