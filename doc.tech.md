# To add a new field type (control)

- ./bin/custom/default/model.json > add control in "fiControlSelectValue"


- ./bin/custom/default/language.json > add control in "fiControlSelectLabel"


- ./bin/index.html :
	add a "div #apix_frameXxxxFieldDataProto" if necessary
	modify "div #apix_control select"
	
- if UICompo then add XxxxField.init in Main.hx

- put classes\html\apix\default\XxxxField\ in Apix-MyBox\www\apix\default\

- If necessary verify and modify apix.ui.XxxxField.hx (UICompo)

- create ./src/myBox/boxes/XxxxField_.hx from an other control
			create initXxxxxField() , askUpdateXxxxField() and onInsertXxxxField()
			modify :
				displayInRecordFrame() 
				dataToScreen() and screenToData() if necessary
			override : 
				getValueToSave() and getDisplayValue() if necessary
				
- ./src/myBox/boxes/Form.hx :
	setupFormFields()
	createFieldAfterInsert()
	
- ./src/myBox/boxes/AbstractFormField.hx : 	
	makeFieldsEntryCoherent()
	initFieldValue()
	setupFromControl()
	onControlChange()
	
- ./src/myBox/boxes/Field.hx > @enum abstract Control > add control 

- SingleFormRecordMng.hx
	modify jsonFieldDatas var if necessary
	
- ./src/View.hx
	add var frameXxxxFieldDataProto (if necessary) ex:frameRadioFieldDataProto	

- ./src/myBox/boxes/FieldData.hx if necessary > idem than LinkField

- ./bin/server.php : 	
	modify $dtArr
	create updateXxxxField()
	create readXxxxField()
	modify :
		updateField()
		deleteField()
		readFields()
		
- ./bin/dbCreate.php : 	
	add "CREATE TABLE xxxxfields ..."
		
- MySql :
	create table xxxxfields 
	modify column control of table fields (enum list)
	
- for cordova app : 
	* add cordova plugins if necessary
	* update 	online php : http://www.apixline.org/pm/app/web/myBox/php/ 
		and 	online table fields (enum list) 
		and 	online mysql create table xxxxfields if necessary
	* change baseUrl.js and do cordova build --release android then install (see cordova.doc.txt)
		
# Runtime flow :
	
	fields read :
		Form.setupFormFields() call by : Model.setupTree() 
		Model.setupTree() call by : Controler.doAfterConnexion()
	
	display one record	
		Field or XxxxField.displayInRecordFrame() call by SingleFormRecordMng.showRecordFrame()
		SingleFormRecordMng.showRecordFrame() call by Record.onUpdateClick()
- 