const actionContainer = this.document.getElementById('ISActionContainer'),
      twostepsContainer = this.document.getElementById('ISTwoStepsContainer'),
      associateContainer = this.document.getElementById('ISAssociateContainer'),
      postBlock = this.document.getElementById('ISPostInfo'),
      postText = this.document.getElementById('ISPostText'),
      ensStartBtn = this.document.getElementById('ISensStart'),
      firstStepBtn = this.document.getElementById('ISFirstStepAction'),
      matchName = this.document.getElementById('ISMatchName'),
      confirmPostText = this.document.getElementById('ISConfirmPostText'),
      confirmPostContainer = this.document.getElementById('ISConfirmPostContainer');

function resetToInitialConfiguration () {
    twostepsContainer.style.display = 'none';
    associateContainer.style.display = 'none';
    confirmPostContainer.style.display = 'none';
    confirmPostText.innerText = '';
    postText.innerText = '';
}

window.onmessage = function(e){
    if(e.type === 'message' && e.origin === 'https://twitter.com') {
        let postData = this.JSON.parse(e.data).message,
            avatar = this.document.getElementById('ISAvatar'),
            
            identificator = this.document.getElementById('ISIdentificator'),
            userFullname = this.document.getElementById('ISUserFullname'),
            username = this.document.getElementById('ISUsername');

        window.contextObj = postData;

        resetToInitialConfiguration();

        actionContainer.style.display = 'block';
       
        userFullname.innerText = postData.authorFullname;
        username.innerText = postData.authorUsername;
        if (postData.authorImg) {
            avatar.src = postData.authorImg;
        }

        if (postData.text) {
            postBlock.style.display = 'block';
            postText.innerText = postData.text;
            identificator.innerText = postData.id;
        } else {
            postBlock.style.display = 'none';
        }
        
    }
 };

ensStartBtn.addEventListener('click', e => {
    actionContainer.style.display = 'none';
    postBlock.style.display = 'none';
    twostepsContainer.style.display = 'block';
    
});

firstStepBtn.addEventListener('click', e => {
    if (window.contextObj.authorFullname.includes('.eth')) {
        console.log(window.contextObj.authorFullname,  'Match!');
        twostepsContainer.style.display = 'none';
        matchName.innerText = window.contextObj.authorFullname;
        associateContainer.style.display = 'block';
    } else {
        console.log('Fail!');
        twostepsContainer.style.display = 'none';
        confirmPostContainer.style.display = 'block';
        if (window.contextObj.text) {
            let confirmPostInfo = this.document.getElementById('ISConfirmPostInfo');
            confirmPostText.innerText = window.contextObj.text;
            confirmPostInfo.style.display = 'block';
        }
    }
 });

 