-- AlterTable
ALTER TABLE "article_versions" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;
