//Controller class, quickly reusable access
//To any attributes
//All JS work passes
//Towards this class
class Controller {
    constructor() {
        this.domObjects = { 
            uploadButton: document.getElementById('upload-button'),
            uploadImageForm: document.getElementById('upload-form'),
            formInput: document.getElementById('image-upload'),
            uploadForm: document.getElementById('image-upload-form'),
            userImageContainer: document.getElementById('user-image-container'),
            referenceImageContainer: document.getElementById('reference-image-container'),
            referenceImage: document.getElementById('reference-image')
        }
        this.currentPairColor;
        this.coordinatePairs = [];
        this.eventList = [];
        this.lastEvent;
        this.uploadedImage;
    }

    //Wires domObjects with javascript functions
    activateButtons = () => {
        this.#reassignUploadButton();
        this.#createUploadInteraction();
        this.#createClearSelectionInteraction();
        this.#createRestoreInteraction();
    }

    // Declares and instantiates a MutationObserver to start the 
    // Click event listening after user uploads image
    startObserver = () => {
        const observerCallback = (mutationList, observer) => {
            for (const mutation of mutationList) {
              if (mutation) {
                /** 
                 * Once a change on observed element is detected
                 * the observer stop observing and calls the 
                 * method that controls the coordinate pairs
                 */
                observer.disconnect();
                this.#startCoordinatePairWatcher();
              }
            }
        };
        const observer = new MutationObserver(observerCallback)
        observer.observe(this.domObjects.userImageContainer, { childList: true });
    }


    /**
     * Private methods only
     * Handle Controller Instance
     * Properties and values
     */

    //Wires UploadButton with form.input
    #reassignUploadButton = () => {
        this.domObjects.uploadButton.addEventListener('click', () => {
            this.domObjects.formInput.click();
        })
    }

    #createUploadInteraction = () => {  
        this.domObjects.uploadForm.addEventListener('change', (event) => {
            const selectedFile = event.target.files[0];
    
            if (selectedFile) {
            if (!selectedFile.type.match('image.*')) {
                alert('Please select an image file.');
                return;
            }
        
            const reader = new FileReader();
        
            reader.onload = (e) => {
                const image = new Image();
                image.src = e.target.result;
                image.setAttribute('id', 'user-image')
                this.domObjects.uploadedImage = image;
                image.onload = () => {
                    this.domObjects.userImageContainer.replaceChildren(image);
                };
            };
            
            reader.readAsDataURL(selectedFile);
            };
        });
    }

    #createClearSelectionInteraction = () => {
        const button = document.getElementById('clear-selection-button')
        button.addEventListener('click', this.#clearSelection)
    }

    #createRestoreInteraction = () => {
        const button = document.getElementById('restore-button')
        button.addEventListener('click', this.#restore)
    }

    // Removes all dots from screen, removes darken filter from images
    // Clears all data from previous selections
    #clearSelection = () => {
        if (document.getElementById('user-image')){
        const userImage = this.domObjects.userImageContainer.firstChild;
        this.domObjects.userImageContainer.replaceChildren(userImage);
        this.domObjects.referenceImageContainer.replaceChildren(this.domObjects.referenceImage);
        this.#undarkenPreviousImage()
        this.#clearEventList();
        this.#clearCoordinatePairs();
        this.#clearLastEvent();
        }
    }

    #restore = () => {
        location.reload();
    }

    #clearEventList = () => {
        this.eventList = []
    }
    #clearCoordinatePairs = () => {
        this.coordinatePairs = []
    }

    #clearLastEvent = () => {
        this.lastEvent = undefined
    }

    // Grabs last two additions to eventList and 
    // creates a pair of coordinates to be pushed further
    #pushCoordinatePairs = () => {
        const lastTwoEvents = this.eventList.slice(-2)
        const from = lastTwoEvents.find(event => event.target.id === 'user-image')
        const to = lastTwoEvents.find(event => event.target.id === 'reference-image')
        const pair = { from: [from.offsetX + from.target.x, from.offsetY + from.target.y], to: [to.offsetX + to.target.x, to.offsetY + to.target.y]}
        this.coordinatePairs.push(pair);
    }

    // Adds listeners to both
    // Images to start taking information and 
    // creating the coordinate pairs
    #startCoordinatePairWatcher = () => {
        /**
         * targetImage is not declared inside constructor as it needs to
         * be retrieved after observer's call
         */
        const userImage = document.getElementById('user-image'); 
        const referenceImage = document.getElementById('reference-image');
        
        userImage.addEventListener('click', (event) => {
            this.#startPairSelection(event)
        });

        referenceImage.addEventListener('click', (event) => {
            this.#startPairSelection(event)
        })
    }
    // Checks if two selections are happening on same image
    // Proceeds to work as a pipeline if not
    #startPairSelection = (event) => {
        const currentClicked = event.target;
        const lastClicked = this.lastEvent?.target
        if (currentClicked === lastClicked) {
            alert('You must click the other image')
            return
        } else {
            // Get click coordinates relative to the image element
            const x = event.offsetX + event.target.x;
            const y = event.offsetY + event.target.y;
            
            this.#pushEventToEventList(event);
            this.#undarkenPreviousImage();
            this.#darkenCurrentImage(event.target);
            this.#setLastEvent(event)
            this.#createAndAppendDotElement(x, y, event.target)
            this.#checkAndCreatePairs();
            this.#appendSendButtonToDom();
        }
    }

    //Creates new dots and adds to images
    #createAndAppendDotElement = (x, y, target) => {
        const dot = document.createElement('div');
        dot.className = 'dot'
        dot.style.cssText = `
            position: absolute;
            left: ${x - 3}px;
            top: ${y - 3}px;
            width: 6px;
            height: 6px;
            background-color: red;
            border-radius: 50%;
        `;
        target.parentNode.appendChild(dot);
        return target;
    };

    #undarkenPreviousImage = () => this.lastEvent?.target.classList.remove('darken');

    #darkenCurrentImage = (target) => target.classList.add('darken');

    #pushEventToEventList = (event) => this.eventList.push(event);

    #setLastEvent = (event) => this.lastEvent = event;

    #checkAndCreatePairs = () => {
        if (this.eventList.length % 2 === 0){
            this.#pushCoordinatePairs();
        }
    }

    // After 4 pairs have been created
    // An action button to send information appears
    #appendSendButtonToDom = () => {
        if (this.coordinatePairs.length == 4) {
            const button = document.getElementById('send-button')
            button.classList.remove('hidden')
        }
    }
}

const controller = new Controller();
controller.activateButtons()
controller.startObserver();