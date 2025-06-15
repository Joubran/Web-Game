
import { calculateOptimalSolution } from '@/utils/solver'

export function generateLevel(columnCount) {
    // 1. Генерируем массив колонок со случайными высотами (1-9)
    const columns = Array.from({ length: columnCount },
        () => Math.floor(Math.random() * 9) + 1);

    // 2. Вычисляем оптимальное решение
    const solution = calculateOptimalSolution(columns);

    // 3. Формируем результат
    return {
        columns,
        optimalContainers: solution.totalContainers,
        solutionMatrix: solution.solutionMatrix
    };
}


