Ext.define('App.controller.IndexSource.IndexSource_Registration_Controller', {
    extend: 'Ext.app.Controller',
    views: ['App.view.EDM.Registration.IndexSource.IndexSource_Registration'],
    stores:['App.store.IndexSource.IndexTypeMasterStore','App.store.BusinessUnitStore'],
    models:['App.model.IndexSource.IndexTypeMasterModel','App.model.BusinessUnitModel'],
    init : function(){
    	this.control({
    		'indexSourceRegistration' : {
    			beforerender:function(cmp){
    				var indexTypeStore = Ext.data.StoreManager.lookup('App.store.IndexSource.IndexTypeMasterStore'); 
    				cmp.down('combobox[name=sourcetype]').bindStore(indexTypeStore);      
    				
    				var businessUnitStore = Ext.data.StoreManager.lookup('App.store.BusinessUnitStore');
    				cmp.down('combobox[name=ISBuAllocated]').bindStore(businessUnitStore);  				

    			},
    			validitychange : function(cmp, valid, eOpts){
    				if(valid){
    					cmp.owner.getDockedItems()[0].items.items[0].setDisabled(false);
    					//cmp.owner.getDockedItems()[0].items.items[1].setDisabled(false);   //uncomment when test button is used 					
    				}
    				else{
    					cmp.owner.getDockedItems()[0].items.items[0].setDisabled(true);
    					//cmp.owner.getDockedItems()[0].items.items[1].setDisabled(true);	//uncomment when test button is used
    				}
    			}   			
    			
    		},
    		
    		'indexSourceRegistration combobox[name=sourcetype]' :{
    			select : function(cmp, newValue, oldValue, eOpts ) {
    				var saveFlagValue = Ext.ComponentQuery.query('indexSourceRegistration')[0].down('hiddenfield[name=indexSourceSaveFlag]').getValue();
    				if(saveFlagValue == 'insert'){        				
        				var selectedValue = cmp.getDisplayValue();    				
        				var selectedIndex , insertNewFieldAtIndex;
        				var thisPanel = cmp.up('form');
        				var portFieldObj = thisPanel.down('textfield[name=portNumber]');
        				var connUrlObj = thisPanel.down('textfield[name=connUrl]');
        				var portFieldIndex = thisPanel.items.indexOf(portFieldObj);
        				
        				//Assuming that all dynamic fields are placed between port number and connection url fields
        				insertNewFieldAtIndex = portFieldIndex+1;
        				var indexTypeStore = cmp.getStore();

        				//iterating to find the index of the selected index source
        				for(var i=0; i<indexTypeStore.getCount(); i++)
        				{
        					if(indexTypeStore.getAt(i).data.sourceType == selectedValue)
        					{
        						selectedIndex = i;
        						break;
        					}
        				}
        				connUrlObj.setValue(indexTypeStore.getAt(selectedIndex).data.connectionUrl);

        				//ajax call for getting details of the columns to be displayed
        				Ext.Ajax.request({
    	 					url: 'getIndexSourceParams.action',
    	 					scope:this,
    	 					params : {			
    	 						randomKey:randomKey,
    	 						languageSelected: languageSelected,
    	 						edmUserId:userName,
    	 						indexSourceType : selectedValue
    	 					},
    	 					success: function(response){
    	 						var resp = Ext.decode(response.responseText);
    	 						if(resp.success)
    	 						{
    	 							var paramsList = resp.list;
        	 						var thisPanel = cmp.up('form');
        	 						
        	 						/* Removing the dynamic fields of the last selected index source (if any) to avoid redundant columns
        	 						For future reference : add checks for all types of index sources */
        	 						if(thisPanel.down('textfield[name=Instance Name]')!=undefined)
        	 						{
        	 							thisPanel.remove(thisPanel.down('textfield[name=Instance Name]'));
        	 						}
        	 						if(thisPanel.down('textfield[name=Core Name]')!=undefined)
        	 						{
        	 							thisPanel.remove(thisPanel.down('textfield[name=Core Name]'));
        	 						}   	 						   	 						
        	 						
        	 					    //adding items to the form dynamically according to ui type 
        	 						var displayItem;
        	 						for(var i=0; i<paramsList.length; i++)
        	 						{
        	 							displayItem = this.createPanelItem(paramsList[i]);
        	 							thisPanel.insert(insertNewFieldAtIndex + i, displayItem);	 							
        	 						}
        	 						
        	 						thisPanel.doLayout();
    	 						}
    	 						else
    	 						{
    	 							Ext.MessageBox
        							.show( {
        								title : 'Error',
        								msg : 'Error in getting columns of Index Source.',
        								buttons : Ext.MessageBox.OK,
        								icon : Ext.MessageBox.ERROR
        							});
    	 						}
    	 					},
    	 					failure: function(response){
    	    					Ext.MessageBox
    							.show( {
    								title : 'Error',
    								msg : 'Error in getting columns of Index Source.',
    								buttons : Ext.MessageBox.OK,
    								icon : Ext.MessageBox.ERROR
    							});
    	    				}
        				});       				
    				}    				
    			}    			
    		},
    		
    		'indexSourceRegistration checkbox[name=authenticationFlag]' : {
    			change : function( cmp, newValue, oldValue, eOpts){
    				var thisPanel = cmp.up('form');    				
    				if(newValue){    					
    					thisPanel.down('textfield[name=userName]').show();    					
    					thisPanel.down('textfield[name=indexPassword]').show();   
    					thisPanel.down('textfield[name=userName]').allowBlank= false;
    					thisPanel.down('textfield[name=indexPassword]').allowBlank= false;
    					cmp.fireEvent('validitychange');    					
    				}
    				else{    					
    					thisPanel.down('textfield[name=userName]').hide();    					
    					thisPanel.down('textfield[name=indexPassword]').hide();
    					thisPanel.down('textfield[name=userName]').allowBlank= true;
    					thisPanel.down('textfield[name=indexPassword]').allowBlank= true;
    					cmp.fireEvent('validitychange');    					
    				}
    			}
    		},
    		
    		'indexSourceRegistration textfield[name=serverName]':{
    			blur: function(cmp, The, eOpts ){
    				var thisPanel = cmp.up('form');
    				var connUrlField = thisPanel.down('textfield[name=connUrl]');
    				var connUrlvalue = connUrlField.getValue();	
    				var newUrlValue;
    				var serverValue = thisPanel.down('textfield[name=serverName]').getValue();
    				var portValue = thisPanel.down('textfield[name=portNumber]').getValue();
    				var sourceTypeCombo = thisPanel.down('combobox[name=sourcetype]');
    				if(sourceTypeCombo.getDisplayValue()=='Solr')
    				{
    					var instanceNameField = thisPanel.down('textfield[name=Instance Name]');
        				var coreNameField = thisPanel.down('textfield[name=Core Name]');
        				var instanceValue, coreValue;
        				if(instanceNameField == null){
        					instanceValue = '';
        				}
        				else{
        					instanceValue = instanceNameField.getValue();
        				}
        				if(coreNameField == null){
        					coreValue = '';
        				}
        				else{
        					coreValue = coreNameField.getValue(); 
        				}
        				if(connUrlvalue!= null && connUrlvalue!='')
        				{
        					var oldurl=sourceTypeCombo.getValue();
        	            	var newurl = oldurl.replace(/{server}/g,serverValue);
        	            	newurl = newurl.replace(/{port}/g,+portValue);
        	            	newurl = newurl.replace(/{instance name}/g, instanceValue);
        	            	newurl = newurl.replace(/{core name}/g, coreValue);
        	            	connUrlField.setValue(newurl);
        				}        				
        				
    				}    				
    			}
    		},
    		
    		'indexSourceRegistration textfield[name=portNumber]':{
    			blur: function(cmp, The, eOpts ){
    			var thisPanel = cmp.up('form');
				var connUrlField = thisPanel.down('textfield[name=connUrl]');
				var connUrlvalue = connUrlField.getValue();	
				var newUrlValue;
				var serverValue = thisPanel.down('textfield[name=serverName]').getValue();
				var portValue = thisPanel.down('textfield[name=portNumber]').getValue();
				var sourceTypeCombo = thisPanel.down('combobox[name=sourcetype]');
				if(sourceTypeCombo.getDisplayValue()=='Solr')
				{
					var instanceNameField = thisPanel.down('textfield[name=Instance Name]');
    				var coreNameField = thisPanel.down('textfield[name=Core Name]');
    				var instanceValue, coreValue;
    				if(instanceNameField == null){
    					instanceValue = '';
    				}
    				else{
    					instanceValue = instanceNameField.getValue();
    				}
    				if(coreNameField == null){
    					coreValue = '';
    				}
    				else{
    					coreValue = coreNameField.getValue(); 
    				}
    				if(connUrlvalue!= null && connUrlvalue!='')
    				{
    					var oldurl=sourceTypeCombo.getValue();
    	            	var newurl = oldurl.replace(/{server}/g,serverValue);
    	            	newurl = newurl.replace(/{port}/g,+portValue);
    	            	newurl = newurl.replace(/{instance name}/g, instanceValue);
    	            	newurl = newurl.replace(/{core name}/g, coreValue);	
    	            	connUrlField.setValue(newurl);
    				}
    				}
    			}
    		},
    		
    		'indexSourceRegistration textfield[name=Instance Name]':{
    			blur: function(cmp, The, eOpts ){
    			var thisPanel = cmp.up('form');
				var connUrlField = thisPanel.down('textfield[name=connUrl]');
				var connUrlvalue = connUrlField.getValue();	
				var newUrlValue;
				var serverValue = thisPanel.down('textfield[name=serverName]').getValue();
				var portValue = thisPanel.down('textfield[name=portNumber]').getValue();
				var sourceTypeCombo = thisPanel.down('combobox[name=sourcetype]');
				if(sourceTypeCombo.getDisplayValue()=='Solr')
				{
					var instanceNameField = thisPanel.down('textfield[name=Instance Name]');
    				var coreNameField = thisPanel.down('textfield[name=Core Name]');
    				var instanceValue, coreValue;
    				if(instanceNameField == null){
    					instanceValue = '';
    				}
    				else{
    					instanceValue = instanceNameField.getValue();
    				}
    				if(coreNameField == null){
    					coreValue = '';
    				}
    				else{
    					coreValue = coreNameField.getValue(); 
    				}
    				if(connUrlvalue!= null && connUrlvalue!='')
    				{
    					var oldurl=sourceTypeCombo.getValue();
    	            	var newurl = oldurl.replace(/{server}/g,serverValue);
    	            	newurl = newurl.replace(/{port}/g,+portValue);
    	            	newurl = newurl.replace(/{instance name}/g, instanceValue);
    	            	newurl = newurl.replace(/{core name}/g, coreValue);	
    	            	connUrlField.setValue(newurl);
    				}
    				}
    			}
    		},
    		
    		'indexSourceRegistration textfield[name=Core Name]':{
    			blur: function(cmp, The, eOpts ){
    			var thisPanel = cmp.up('form');
				var connUrlField = thisPanel.down('textfield[name=connUrl]');
				var connUrlvalue = connUrlField.getValue();	
				var newUrlValue;
				var serverValue = thisPanel.down('textfield[name=serverName]').getValue();
				var portValue = thisPanel.down('textfield[name=portNumber]').getValue();
				var sourceTypeCombo = thisPanel.down('combobox[name=sourcetype]');
				if(sourceTypeCombo.getDisplayValue()=='Solr')
				{
					var instanceNameField = thisPanel.down('textfield[name=Instance Name]');
    				var coreNameField = thisPanel.down('textfield[name=Core Name]');
    				var instanceValue, coreValue;
    				if(instanceNameField == null){
    					instanceValue = '';
    				}
    				else{
    					instanceValue = instanceNameField.getValue();
    				}
    				if(coreNameField == null){
    					coreValue = '';
    				}
    				else{
    					coreValue = coreNameField.getValue(); 
    				}
    				if(connUrlvalue!= null && connUrlvalue!='')
    				{
    					var oldurl=sourceTypeCombo.getValue();
    	            	var newurl = oldurl.replace(/{server}/g,serverValue);
    	            	newurl = newurl.replace(/{port}/g,+portValue);
    	            	newurl = newurl.replace(/{instance name}/g, instanceValue);
    	            	newurl = newurl.replace(/{core name}/g, coreValue);	
    	            	connUrlField.setValue(newurl);
    				}
    				}
    			}
    		},  		
    		
    		
    		'indexSourceRegistration button[name=saveIndexSourceDetails]':{
    			click: function(cmp){
    				var thisPanel = cmp.up('form');
    				var indexSourceForm = thisPanel.getForm(); 
    				var dynamicFieldNames= [];
    				var portFieldObj = thisPanel.down('textfield[name=portNumber]');
    				var connUrlObj = thisPanel.down('textfield[name=connUrl]');
    				var portFieldIndex = thisPanel.items.indexOf(portFieldObj);
    				var connUrlFieldIndex = thisPanel.items.indexOf(connUrlObj);
    				
    				//Get names of all dynamic fields
    				for(var j=(portFieldIndex+1); j<connUrlFieldIndex; j++)
    				{
    					dynamicFieldNames.push(thisPanel.items.items[j].getFieldLabel());
    				}    				
    				
    				var indexSourceUserName;
    				var password, encryptedPassword;
    				var instanceNameField = thisPanel.down('textfield[name=Instance Name]');
    				var coreNameField = thisPanel.down('textfield[name=Core Name]');
    				var indexSourceType = thisPanel.down('combobox[name=sourcetype]').getDisplayValue();
    				var sourceName = thisPanel.down('textfield[name=sourceName]').getValue();
    				var serverName =  thisPanel.down('textfield[name=serverName]').getValue();
    				var port = thisPanel.down('textfield[name=portNumber]').getValue();    				    				
    				var connStr = thisPanel.down('textfield[name=connUrl]').getValue();    				
    				var ownerId = thisPanel.down('textfield[name=ownerIdForUpdate]').getValue();
    				var mappedtoBuValue = thisPanel.down('textfield[name=ISBuAllocated]').getValue();
    				var saveFlagValue = Ext.ComponentQuery.query('indexSourceRegistration')[0].down('hiddenfield[name=indexSourceSaveFlag]').getValue();
    				var idHiddenFieldValue = Ext.ComponentQuery.query('indexSourceRegistration')[0].down('hiddenfield[name=indexSourceID]').getValue();
    				var instanceName;
    				var coreName;
    				if(instanceNameField == null){
    					instanceName = '';
    				}
    				else{
    					instanceName = instanceNameField.getValue();
    				}
    				if(coreNameField == null){
    					coreName = '';
    				}
    				else{
    					coreName = coreNameField.getValue(); 
    				}
    				
    				var authFlag = thisPanel.down('checkbox[name=authenticationFlag]').getValue();
    				if(authFlag)
    				{
    					indexSourceUserName = thisPanel.down('textfield[name=userName]').getValue();
        				password = thisPanel.down('textfield[name=indexPassword]').getValue();
        				encryptedPassword = this.encode64IndexSource(password);
    				}
    				else
    				{
    					thisPanel.down('checkbox[name=authenticationFlag]').setValue(false);
    					indexSourceUserName ='';
    					password='';
    					encryptedPassword ='';
    				}    				
    				
    				if(indexSourceForm.isValid()){
    					var loadMask = new Ext.LoadMask(Ext.WindowManager.getActive(), {msg:"Saving..."});
        				loadMask.show();
    					Ext.Ajax.request({
    	 					url: 'InsertSingleRecord.action',
    	 					scope:this,
    	 					params : {			
    	 						randomKey:randomKey,
    	 						languageSelected: languageSelected,
    	 						userId:userName,
    	 						indexSourceType : indexSourceType,
    	 						indexSourceName:sourceName,
    	 						indexServerName : serverName,
    	 						indexSourcePort : port,
    	 						indexInstanceName:instanceName,
    	 						indexCoreName :coreName,
    	 						indexConnString : connStr,
    	 						ownerId :ownerId,
    	 						businessUnit :businessUnit,
    	 						authFlag:authFlag,
    	 						indexSourceUserName : indexSourceUserName,
    	 						password :encryptedPassword,
    	 						catagory:'IS0',
    	 						recordType:saveFlagValue,
    	 						mapppedtoBu: mappedtoBuValue,
    	 						dynamicFieldNames :dynamicFieldNames,
    	 						indexSourceId : idHiddenFieldValue
    	 					},
    	 					success : function(response){
    	 						loadMask.hide();
    	 						var resp =  Ext.decode(response.responseText);
    	 						
    	 						if(resp.success){
    	 							if(resp.status){
    	 								var thisPanel = cmp.up('form');
    	 								var indexSourceMasterStore = Ext.ComponentQuery.query('indexSourceListPanel')[0].down('grid').getStore();
    	 								//var indexSourceMasterStore = Ext.create('App.store.IndexSource.IndexSourceMasterStore');	 			    				
    	 			    				indexSourceMasterStore.load();
    	 			    				cmp.up('window').close();
    	 			    				if(saveFlagValue=='insert'){
                                        var dispMsg : 'Index Source \''+ sourceName +'\' is saved successfully.';
                                           getMessageBox('Success',dispMsg,Ext.MessageBox.OK,Ext.MessageBox.INFO);

    	 			    				}
    	 			    				else if(saveFlagValue=='update'){
    	 			    					if(resp.indexSourceConfigured!=undefined){ 
                                                var dispMsg='\''+sourceName +'\' updated successfully. It is used in matching environment \''+ resp.indexSourceConfigured+'\'. Please execute the matching environment to reflect these changes.';
                                            getMessageBox('Status',dispMsg,Ext.MessageBox.OK,Ext.MessageBox.INFO); 			    						
    	 			    					}else{
                                                  var dispMsg= '\''+sourceName +'\' updated successfully.';
                                                getMessageBox('Success',dispMsg,Ext.MessageBox.OK,Ext.MessageBox.INFO); 
    	
    	 			    					}    	 			    					
    	 			    				}
    		 							
    		 						}
    	 							else{
    	 								loadMask.hide();
                                         var dispMsg= 'Index Source already exists. Please provide a different name.';
                                                getMessageBox('Error',dispMsg,Ext.MessageBox.OK,Ext.MessageBox.INFO); 
            	 							}
    	 						}	
    	 						else{
    	 							if(resp.exceptionFlag){
                                             exception(resp.exception);															
                                    }
                                        else{
    	 							loadMask.hide();
                                       var dispMsg=  'Error in saving Index Source';
                                                getMessageBox('Error',dispMsg,Ext.MessageBox.OK,Ext.MessageBox.INFO); 
                                            }
        		    			
        		    				
    	 						
        		    			}
    	 					},
    	 					failure: function(response){
    	 						loadMask.hide();
                                  var dispMsg=  'Error in saving Index Source';
                                                getMessageBox('Error',dispMsg,Ext.MessageBox.OK,Ext.MessageBox.INFO); 
                                            }
    	    				    	    				}
        				});
    				}
    				
 
    				
    			}    			
    		},
    		
    		'indexSourceRegistration button[name=cancelButton]':{
    			click: function(cmp){
    				var thisPanel = cmp.up('window');
    				thisPanel.close();
    			}    			
    		},
    		
    		
    		'indexSourceRegistration checkcombo[name=ISBuAllocated]' : {
    			beforerender : function(cmp){
    				var businessUnitStore = Ext.data.StoreManager.lookup('App.store.BusinessUnitStore');
    				businessUnitStore.load();        			
    				cmp.bindStore(businessUnitStore);
    			}    			
    		}
    		
    	});
    },
    
    createPanelItem : function(param) {	//Same method in IndexSourceListPanelController - all changes in this method must be copied there
    	
        var indexSourceHandler = new IndexSourceHandler();
    	if(param.uiField == 'textfield'){    		
    	
    		return indexSourceHandler.createParamTextField(param);
    	}
    	else if(param.uiField == 'checkbox')
    	{
    		return indexSourceHandler.createParamCheckBox(param);
    	}
    },
    
    encode64IndexSource : function(input) {
    	var output = "";
    	var chr1, chr2, chr3;
    	var enc1, enc2, enc3, enc4;
    	var i = 0;

    	do {
    		chr1 = input.charCodeAt(i++);
    		chr2 = input.charCodeAt(i++);
    		chr3 = input.charCodeAt(i++);

    		enc1 = chr1 >> 2;
    		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    		enc4 = chr3 & 63;

    		if (isNaN(chr2)) {
    			enc3 = enc4 = 64;
    		} else if (isNaN(chr3)) {
    			enc4 = 64;
    		}

    		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
    				+ keyStr.charAt(enc3) + keyStr.charAt(enc4);
    	} while (i < input.length);

    	return output;
    }
});


function getMessageBox(title,dispMsg,buttons,icon){

       return      Ext.MessageBox.show( {
                        title : title,
                        msg : dispMsg,
                        buttons : buttons,
                        icon: icon
            });

}


function createParamTextField(param){
    var spercialCharwithout_="Should not start with space or number and should not contain special character except underscore";
    var specialChar="Should not start with space or number and should not contain special characters";
            if(param.mandatory= true)
            {
             return  param.displayName=='Core Name' ?
                                 getTextField(param,spercialCharwithout_,'required',false) :
                                 getTextField(param,specialChar,'required',false);
            }
            else
            {
               return  getTextField(param,specialChar,'not required',true);
            }
}

   

    function createParamCheckBox(param){

        return param.mandatory == true ?
               getCheckBox(param,'required',false):
               getCheckBox(param,'not required',true);

    }






function IndexSourceHandler (param) {
   //Add properties required for IndexSourceHandler here
}
 
IndexSourceHandler.prototype.getTextField = function(param,regexText,afterLabelTextTpl,allowBlank) {
    return   new Ext.form.field.Text({
                        margin:'10,0,5,5',
                        name: param.displayName,
                        fieldLabel: param.displayName,
                        width:250,                  
                        labelAlign : 'top', 
                        regex : /^[^ !@#$%^&*0-9][ A-Za-z0-9_]+$/,
                        regexText: regexText, 
                        maxLength:30,
                        maxLengthText:'Please enter value less than 30 characters',
                        afterLabelTextTpl: afterLabelTextTpl,
                        allowBlank:allowBlank
                    });
};


IndexSourceHandler.prototype.getCheckBox = function(param,afterLabelTextTpl,allowBlank) {
    return   new Ext.form.field.Checkbox({
                    margin:'10,0,5,5',
                    name: param.displayName,
                    fieldLabel: param.displayName,
                    width:250,                  
                    labelAlign : 'top', 
                    checked:false,
                    afterLabelTextTpl: afterLabelTextTpl,
                    allowBlank:allowBlank
                });
};
