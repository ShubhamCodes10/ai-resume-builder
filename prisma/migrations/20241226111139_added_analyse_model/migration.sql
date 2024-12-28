-- AlterTable
ALTER TABLE "Resume" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "DailyUsage" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnalysis" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "jobFitPercentage" INTEGER NOT NULL,
    "overallAssessment" TEXT NOT NULL,
    "analysisTimestamp" TIMESTAMP(3) NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "areasForImprovement" JSONB NOT NULL,
    "atsImprovements" JSONB NOT NULL,
    "experienceAnalysis" JSONB NOT NULL,
    "projectAnalysis" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "skillsMatch" JSONB NOT NULL,
    "strengths" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyUsage" ADD CONSTRAINT "DailyUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnalysis" ADD CONSTRAINT "UserAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
