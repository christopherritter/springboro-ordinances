REM This file converts all of the Markdown files to HTML. 

REM Converting in the current directory
REM %%~ni returns just the filename of %%i, not its extension
for %%i in (*.markdown) do pandoc -f markdown -t html5 %%~ni.markdown > html/%%~ni.html

REM Converting a subdirectory - just slap it on front
for %%i in (report_pages/*.markdown) do pandoc -f markdown -t html5 report_pages/%%~ni.markdown > html/report_pages/%%~ni.html
