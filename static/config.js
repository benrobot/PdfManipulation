(function() {
    $(document).on('documentLoaded', function() {
        PDFNet.initialize().then(function(){
            var doc = readerControl.docViewer.getDocument();
            doc.getPDFDoc().then(function(pdfDoc){
                // Ensure that we have our first page.
                pdfDoc.requirePage(1){
                    // Run our script
                    runCustomViewerCode(pdfDoc).then(function(){
                        // Refresh the cache with the newly updated document
                        readerControl.docViewer.refreshAll();
                        // Update viewer with new document
                        readerControl.docViewer.updateView();
                    });
                }
            });
        });
    });

    var runCustomViewerCode = function(doc)
    {
        function* main()
        {
            alert("Hello WebViewer!");
        }
        return PDFNet.runGeneratorWithCleanup(main());
    }
})();
//# sourceURL=config.js