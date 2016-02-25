#Apix-MyBox

...is a mobile and web free aplication.   

You can create folder(s), within other subfolders or forms.  
In each form you can define fields.  
That allows you to enter your various data, organized as you wish, and find your data wherever an Internet connection exists.

- [Change log](CHANGE_LOG.md)

##Run on web :  
- [english](http://www.apixline.org/pm/app/web/myBox/en.html)
- [français](http://www.apixline.org/pm/app/web/myBox/)
- [español](http://www.apixline.org/pm/app/web/myBox/es.html)

##install from:  
- [Firefox-marketplace](https://marketplace.firefox.com/app/Apix-MyBox) for Firefox-OS
- [GooglePlay](https://play.google.com/store/apps/details?id=org.apixline.mybox&hl=fr) for Android 

##Features: 
- MyBox doesn't use a meta-data system to store the records but generates conventional
mySql tables which can be read easily by other applications.
- All platforms (Android or Firefox-OS mobiles ; Web on PC / Mac) access the same database.
Synchronization is not necessary.
- The layout adapts itself to any screen size or ratio -the app is responsive.
- The changes made in the management mode (create/update/delete files, forms or fields)
are immediately reflected in the operating mode (data entry/view). 
- The fields' value may be visible or hidden (eg 'password').  
If a field is hidden, a click on a button makes it visible temporarily.  
Each field can be copied to the clipboard by clicking on a button. 



##Licence 
GNU-GPL

##User guide:
- [english](http://www.apixline.org/pm/app/web/myBox/doc/help.en.html)
- [français](http://www.apixline.org/pm/app/web/myBox/doc/help.fr.html)

##Recommendations :
This app is designed to run on a valid HTML5 browser. 

##Installation 
- Download zip and install the content of **bin/** into local or remote web-server.
- Launch the program ./php/db.create.php to create the database and tables.  
- PHP and MySql required.  

##Facultative modifications : 
 
- Color parameters in **bin/custom/default/model.xml**  
- Pathnames in **bin/js/en.baseUrl.js** or **bin/js/fr.baseUrl.js** or  **bin/js/es.baseUrl.js**  

##Language:  
[Haxe](http://haxe.org/). 

##Dependency :  
[Apix api](https://github.com/flashline/Apix) has to be installed :  
 - in src/  
 - or as haxe lib  
 - or everywhere, adding  -cp everywhere/ in build.xml.

##Contact  
Please inform me of any errors:  
[info@pixaline.net](mailto:info@pixaline.net?subject=Apix-MyBox)  
[twitter](https://twitter.com/intent/tweet?screen_name=flashline_net)

If this application please to you , talk about it around you... 


 
 
