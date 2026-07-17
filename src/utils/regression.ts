export type DataPoint = { x: number; y: number };

export type RegressionResult = {
  slope: number;
  intercept: number;
  predictions: DataPoint[];
  mse: number;
  rmse: number;
  mae: number;
  rSquared: number;
};

export function calculateLinearRegression(data: DataPoint[]): RegressionResult {
  const n = data.length;
  
  if (n === 0) {
    return { slope: 0, intercept: 0, predictions: [], mse: 0, rmse: 0, mae: 0, rSquared: 0 };
  }
  
  if (n === 1) {
    return { slope: 0, intercept: data[0].y, predictions: [{x: data[0].x, y: data[0].y}], mse: 0, rmse: 0, mae: 0, rSquared: 1 };
  }

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += data[i].x;
    sumY += data[i].y;
    sumXY += data[i].x * data[i].y;
    sumXX += data[i].x * data[i].x;
  }

  const meanX = sumX / n;
  const meanY = sumY / n;

  const denominator = (n * sumXX - sumX * sumX);
  // Prevent division by zero if all x values are the same
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = meanY - slope * meanX;

  // Calculate predictions & Errors
  const predictions: DataPoint[] = [];
  let sumSquaredError = 0; // for MSE
  let sumAbsoluteError = 0; // for MAE
  let totalSumOfSquares = 0; // for R^2

  for (let i = 0; i < n; i++) {
    const yPred = slope * data[i].x + intercept;
    predictions.push({ x: data[i].x, y: yPred });
    
    const error = data[i].y - yPred;
    sumSquaredError += error * error;
    sumAbsoluteError += Math.abs(error);
    
    const diffMean = data[i].y - meanY;
    totalSumOfSquares += diffMean * diffMean;
  }

  const mse = sumSquaredError / n;
  const rmse = Math.sqrt(mse);
  const mae = sumAbsoluteError / n;
  
  // R^2 = 1 - (SSR / SST)
  const rSquared = totalSumOfSquares === 0 ? 1 : 1 - (sumSquaredError / totalSumOfSquares);

  return {
    slope,
    intercept,
    predictions,
    mse,
    rmse,
    mae,
    rSquared
  };
}
