        // Containers
const actionContainer = this.document.getElementById('ISActionContainer'),
      firstSuccessContainer = this.document.getElementById('ISFirstStepSuccessContainer'),
      confirmErrorContainer = this.document.getElementById('ISErrorContainer'),
      instructionContainer = this.document.getElementById('ISInstructionContainer'),
      contextContainer = this.document.getElementById('ISContextContainer'),
      twostepsContainer = this.document.getElementById('ISTwoStepsContainer'),
      associateContainer = this.document.getElementById('ISAssociateContainer'),
      confirmPostContainer = this.document.getElementById('ISConfirmPostContainer'),

        // Buttons
      ensStartBtn = this.document.getElementById('ISensStart'),
      firstStepBtn = this.document.getElementById('ISFirstStepAction'),
      notNyENSBtn = this.document.getElementById('ISNotMy'),
      confirmPostBtn = this.document.getElementById('ISConfirmPostAction'),
      firstStepTryAgainBtn = this.document.getElementById('ISensTryAgain'),
      ensContinueBtn = this.document.getElementById('ISensContinue'), 
      helpBtn = this.document.getElementById('ISHelp'),
      leaveInstructionBtn = this.document.getElementById('ISLeaveInstruction'), 
      backBtn = this.document.getElementById('ISBackArrow'), 

        // Other Elements
      avatar = this.document.getElementById('ISAvatar'),
      postBlock = this.document.getElementById('ISPostInfo'),
      postText = this.document.getElementById('ISPostText'),
      matchName = this.document.getElementById('ISMatchName'),
      identificator = this.document.getElementById('ISIdentificator'),
      confirmPostText = this.document.getElementById('ISConfirmPostText'),
      errorTextHeader = this.document.getElementById('ISErrorHeader'),
      errorText = this.document.getElementById('ISErrorText'),
      selectPostHeader = this.document.getElementById('ISSelectPostHeader');
    
let   mainWindow;


window.ISobj = {};
window.ISobj.lastState = '';
window.ISobj.currentState = 'actions';
window.ISobj.arrOfContainers = [actionContainer, twostepsContainer, associateContainer, confirmPostContainer, firstSuccessContainer, confirmErrorContainer, instructionContainer];

function hideExceptSpecified (specified, header, hideContext ) {
    let arrOfContainers = window.ISobj.arrOfContainers;
    arrOfContainers.forEach(element => {
        if (element.id !== specified) {
            element.style.display = 'none';
        } else if (element.id === specified) {
            element.style.display = 'block';
        }
    });
    
    if (hideContext) {
        contextContainer.style.display = 'none';
    } else {
        contextContainer.style.display = 'block';
    }
    setHeader(header);
}

function setHeader(text) {
    let header = this.document.getElementById('ISHeaderText');
    header.innerText = text;
}

function resetToInitialConfiguration () {
    hideExceptSpecified('ISActionContainer', 'Identity Service', false);
    confirmPostText.innerText = '';
    postText.innerText = '';
    errorTextHeader.innerText = 'Error!';
    avatar.src = './avatar.png';
    selectPostHeader.style.display = 'none';
    backBtn.style.display = 'none';
}

window.onmessage = function(e){
    if (e.type === 'message' && e.origin === 'https://twitter.com') {
        let postData = this.JSON.parse(e.data).message,
            userFullname = this.document.getElementById('ISUserFullname'),
            username = this.document.getElementById('ISUsername');

        // mainWindow = e.source;
        // mainWindow.postMessage('msg!');
        window.ISobj.contextObj = postData;

        resetToInitialConfiguration();
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
    postBlock.style.display = 'none';
    hideExceptSpecified('ISTwoStepsContainer', 'Choose confirmation step');
    backBtn.style.display = 'inline';
    window.ISobj.lastState = 'ISActionContainer';
});

firstStepBtn.addEventListener('click', e => {
    if (window.ISobj.contextObj.authorFullname.includes('.eth')) {
        matchName.innerText = window.ISobj.contextObj.authorFullname.match(/\w+\.eth/)[0];
        hideExceptSpecified('ISAssociateContainer', 'Your name has something similar to ENS');
    } else if ( window.ISobj.contextObj.text && window.ISobj.contextObj.text.startsWith('DappletsConfirmation ')) {
        
        if (window.ISobj.contextObj.text.includes('.eth')) {
            matchName.innerText = window.ISobj.contextObj.text.match(/\w+\.eth/)[0];
            hideExceptSpecified('ISAssociateContainer');
        } else {
            errorTextHeader.innerText = 'ENS not found in confirmation post';

            let span = document.createElement('span');
            let p = document.createElement('p');
            span.style.color = 'red';
            span.innerText = window.ISobj.contextObj.text.slice(20);
            p.innerText = window.ISobj.contextObj.text.slice(0, 20);
            p.appendChild(span);
            errorText.appendChild(p);
           
            hideExceptSpecified('ISErrorContainer', 'Failed to read ENS name');
        }
        
    } else {
        hideExceptSpecified('ISInstructionContainer', 'You should write a confirmation post');
        // hideExceptSpecified('ISConfirmPostContainer');
        // if (window.ISobj.contextObj.text) {
        //     let confirmPostInfo = this.document.getElementById('ISConfirmPostInfo');
        //     confirmPostText.innerText = window.ISobj.contextObj.text;
        //     confirmPostInfo.style.display = 'block';
        //     selectPostHeader.style.display = 'block';
        // }
    }

    window.ISobj.lastState = 'ISTwoStepsContainer';
 });

notNyENSBtn.addEventListener('click', e => {
    if ( window.ISobj.contextObj.text && window.ISobj.contextObj.text.startsWith('DappletsConfirmation ')) {
        if (window.ISobj.contextObj.text.includes('.eth')) {
            matchName.innerText = window.ISobj.contextObj.text.match(/\w+\.eth/)[0];
            hideExceptSpecified('ISAssociateContainer');
        } else {
            errorTextHeader.innerText = 'ENS not found in confirmation post';

            let span = document.createElement('span');
            let p = document.createElement('p');
            span.style.color = 'red';
            span.innerText = window.ISobj.contextObj.text.slice(20);
            p.innerText = window.ISobj.contextObj.text.slice(0, 20);
            p.appendChild(span);
            errorText.appendChild(p);
           
            hideExceptSpecified('ISErrorContainer', 'Failed to read ENS name');
        }
    } else {
        hideExceptSpecified('ISInstructionContainer', 'You should write a confirmation post');
    }

    // hideExceptSpecified('ISConfirmPostContainer');
    //     if (window.ISobj.contextObj.text) {
    //         let confirmPostInfo = this.document.getElementById('ISConfirmPostInfo');
    //         confirmPostText.innerText = window.ISobj.contextObj.text;
    //         confirmPostInfo.style.display = 'block';
    //         selectPostHeader.style.display = 'block';
    //     }
});

confirmPostBtn.addEventListener('click', e => {
    if ( window.ISobj.contextObj.text && window.ISobj.contextObj.text.startsWith('DappletsConfirmation ')) {
        
        if(window.ISobj.contextObj.text.includes('.eth')) {
            hideExceptSpecified('ISFirstStepSuccessContainer');
            console.log('Success');
        } else {
            errorTextHeader.innerText = 'ENS not found in confirmation post';

            let span = document.createElement('span');
            let p = document.createElement('p');
            span.style.color = 'red';
            span.innerText = window.ISobj.contextObj.text.slice(20);
            p.innerText = window.ISobj.contextObj.text.slice(0, 20);
            p.appendChild(span);
            errorText.appendChild(p);
           
            hideExceptSpecified('ISErrorContainer', 'Failed to read ENS name');
        }

    } else {
        console.log('Не удалось идентифицировать как подтверждающий пост');
        errorTextHeader.innerText = 'The confirmation post must have the format "DappletsConfirmation yourname.eth"';
        hideExceptSpecified('ISErrorContainer', 'Failed to identify this post as confirming');
    }
    window.ISobj.lastState = 'ISConfirmPostContainer';
});
firstStepTryAgainBtn.addEventListener('click', e => {
    if(window.ISobj.contextObj.text) {
        postBlock.style.display = 'block';
        postText.innerText = window.ISobj.contextObj.text;
        identificator.innerText = window.ISobj.contextObj.id;
    }
    hideExceptSpecified('ISActionContainer', 'Identity Service');
});

ensContinueBtn.addEventListener('click', e => {
    hideExceptSpecified('ISFirstStepSuccessContainer', 'First step is completed successfully');
});

leaveInstructionBtn.addEventListener('click', e => {
    hideExceptSpecified('ISActionContainer', 'Identity Service', false);
});

helpBtn.addEventListener('click', e => {
    hideExceptSpecified('ISInstructionContainer', 'Instruction manual', true);
});

backBtn.addEventListener('click', e => {
    hideExceptSpecified(window.ISobj.lastState);
});