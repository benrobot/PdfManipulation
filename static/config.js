(function() {
    $(document).on('documentLoaded', function() {
        PDFNet.initialize().then(function(){
            var doc = readerControl.docViewer.getDocument();
            doc.getPDFDoc().then(function(pdfDoc){
                console.log("Page count BEFORE ALL: ", readerControl.docViewer.getPageCount());
                // Ensure that we have our first page.
                pdfDoc.requirePage(1).then(function(){
                    console.log("Page count BEFORE runCustomViewerCode: ", readerControl.docViewer.getPageCount());
                    // Run our script
                    runCustomViewerCode(pdfDoc).then(function(){
                        console.log("Page count BEFORE refreshAll: ", readerControl.docViewer.getPageCount());
                        // Refresh the cache with the newly updated document
                        readerControl.docViewer.refreshAll();
                        
                        console.log("Page count BEFORE updateView: ", readerControl.docViewer.getPageCount());
                        // Update viewer with new document
                        readerControl.docViewer.updateView();
                    });
                });
            });
        });
    });

    var runCustomViewerCode = function(pdfDoc)
    {
        function* main()
        {
            console.log("Hello WebViewer!");
            var doc = pdfDoc;
            // doc.initSecurityHandler();
            // doc.lock();
            
            // Example 1) Add text stamp to all pages, then remove text stamp from odd pages. 
            try 
            {
                // start stack-based deallocation with startDeallocateStack. Later on when endDeallocateStack is called,
                // all objects in memory that were initialized since the most recent startDeallocateStack call will be
                // cleaned up. Doing this makes sure that memory growth does not get too high.
                yield PDFNet.startDeallocateStack();

                var stamper = yield PDFNet.Stamper.create(PDFNet.Stamper.SizeType.e_relative_scale, 0.5, 0.5); //Stamp size is relative to the size of the crop box of the destination page
                stamper.setAlignment(PDFNet.Stamper.HorizontalAlignment.e_horizontal_center, PDFNet.Stamper.VerticalAlignment.e_vertical_center);

                var redColorPt = yield PDFNet.ColorPt.init(1, 0, 0);
                stamper.setFontColor(redColorPt);
                var pgSet = yield PDFNet.PageSet.createRange(1, (yield doc.getPageCount()));
                stamper.stampText(doc, "If you are reading this\nthis is an even page", pgSet);
                var oddPgSet = yield PDFNet.PageSet.createFilteredRange(1, (yield doc.getPageCount()), PDFNet.PageSet.Filter.e_odd);
                // delete all text stamps in odd pages
                PDFNet.Stamper.deleteStamps(doc, oddPgSet);

                console.log("Sample 1 complete");

                yield PDFNet.endDeallocateStack();
            } catch (err) {
                console.log(err.stack)
                ret = 1;
            }
            
            
            // Example 2) Add cover page
            try 
            {
                // start stack-based deallocation with startDeallocateStack. Later on when endDeallocateStack is called,
                // all objects in memory that were initialized since the most recent startDeallocateStack call will be
                // cleaned up. Doing this makes sure that memory growth does not get too high.
                yield PDFNet.startDeallocateStack();

                var coverPageDoc = yield PDFNet.PDFDoc.createFromURL("/resources/This_is_a_cover_page.pdf");
                // coverPageDoc.initSecurityHandler();
                // coverPageDoc.lock();
                
                var coverPage = yield coverPageDoc.getPage(1);
                
                var currentPageCount = yield doc.getPageCount();
                console.log("doc pagecount BEFORE pagePushFront: ", currentPageCount);
                
                doc.pagePushFront(coverPage);
                
                currentPageCount = yield doc.getPageCount();
                console.log("doc pagecount AFTER pagePushFront: ", currentPageCount);
                
                // doc.unlock();
                // coverPageDoc.unlock();
                
                console.log("Sample 2 complete");

                yield PDFNet.endDeallocateStack();
            } catch (err) {
                console.log(err.stack)
                ret = 1;
            }      
            
        }
        return PDFNet.runGeneratorWithCleanup(main());
    }
})();
//# sourceURL=config.js