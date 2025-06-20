-- CreateTable
CREATE TABLE "menus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "mainDish" TEXT NOT NULL,
    "sideDish" TEXT,
    "soup" TEXT,
    "rice" TEXT,
    "category" TEXT NOT NULL DEFAULT '和食',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "menus_date_key" ON "menus"("date");
