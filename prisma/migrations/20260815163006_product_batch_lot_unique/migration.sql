-- CreateIndex
CREATE UNIQUE INDEX "ProductBatch_productId_lotNumber_key" ON "ProductBatch"("productId", "lotNumber");
