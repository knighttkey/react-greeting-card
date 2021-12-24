import React, { useState, useEffect, useRef, Fragment } from "react";
import "./Card.scss";
import * as htmlToImage from "html-to-image";
import InApp from "detect-inapp";
import { useSwipeable, Swipeable } from "@bryandollery/react-swipeable";
import Div100vh from "react-div-100vh";
import html2canvas from "html2canvas";
import * as R from "ramda";

import cardTemplateA from "./image/cardTemplateA.png";
import cardTemplateB from "./image/cardTemplateB.png";
var iOsVersion = require("ios-version");

var iOS = require("is-ios");

const Card = () => {
  const textAreaRef = useRef();
  const signatureRef = useRef();
  const textAreaPlaceholderRef = useRef();
  const signaturePlaceholderRef = useRef();
  
  const designFrameRef = useRef();
  const indexFrameRef = useRef();
  const cardPreviewRef = useRef();

  const cardContainerRef = useRef();
  const templateSelectorRef = useRef();
  const templateFirstRef = useRef();
  const templateSecondRef = useRef();

  const [cardTemplate, setCardTemplate] = useState("cardA");
  const [designStep, setDesignStep] = useState(0);
  const [userAgent, setUserAgent] = useState();
  const [currentWindowWidth, setCurrentWindowWidth] = useState(
    window.innerWidth
  );
  const [currentWindowHeight, setCurrentWindowHeight] = useState(
    window.innerHeight
  );

  const [tempCanvas, setTempCanvas] = useState();

  const [textAreaPlaceholderShow, setTextAreaPlaceholderShow] = useState(true);
  const [signatureAreaPlaceholderShow, setSignatureAreaPlaceholderShow] =
    useState(true);
  const [dragStartClientX, setDragStartClientX] = useState();
  const [dragEndClientX, setDragEndClientX] = useState();

  const [downLoadSuccessShow, setDownLoadSuccessShow] = useState(false);

  const isIPhone = navigator.userAgent.indexOf("iPhone") !== -1;
  // console.log("isIPhone", isIPhone);
  const isIPad = navigator.userAgent.indexOf("iPad") !== -1;
  // console.log("isIPad", isIPad);
  const isIPhone15 = navigator.userAgent.indexOf("iPhone OS 15") !== -1;
  // console.log("isIPhone15", isIPhone15);
  const isIPhone14 = navigator.userAgent.indexOf("iPhone OS 14") !== -1;
  // console.log("isIPhone14", isIPhone14);

  // console.log("designStep", designStep);

  // console.log("navigator", navigator);
  // console.log("navigator.userAgent", navigator.userAgent);
  // console.log("iOS", iOS);
  let iosVersion = iOsVersion(navigator.userAgent);
  // console.log("iosVersion", iosVersion);

  if (/Line/.test(navigator.userAgent)) {
    window.location.href = window.location.href + "?openExternalBrowser=1";
  }

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.addEventListener("blur", function () {
        console.log("blur事件");

        if (textAreaRef.current ? textAreaRef.current.value === "": null) {
          console.log('textAreaRef.current', textAreaRef.current)
          console.log("未輸入");
          setTextAreaPlaceholderShow(true);
        } else {
          console.log("有輸入");
          setTextAreaPlaceholderShow(false);
        }
      });
    }
  }, [textAreaRef.current]);

  useEffect(() => {
    if (signatureRef.current) {
      signatureRef.current.addEventListener("blur", function () {
        console.log("blur事件");

        if (signatureRef.current ? signatureRef.current.value === "" : null) {
          console.log("未輸入");
          setSignatureAreaPlaceholderShow(true);
        } else {
          console.log("有輸入");
          setSignatureAreaPlaceholderShow(false);
        }
      });
    }
  }, [signatureRef.current]);

  const fitSafariHeightDesignStep = () => {
    let windowsVH = window.innerHeight / 100;
    let designFrameEle = document.querySelector(".design_frame");
    designFrameEle.style.setProperty("--vh", windowsVH + "px");
    // if(designFrameEle) {
    //   console.log('designFrameEle', designFrameEle)
    //   window.addEventListener('resize', function() {
    //     designFrameEle.setProperty('--vh', windowsVH + 'px');
    //   });
    // }
  };
  const fitSafariHeightIndexStep = () => {
    let windowsVH = window.innerHeight / 100;
    let indexFrameEle = document.querySelector(".index_frame");
    indexFrameEle.style.setProperty("--vh", windowsVH + "px");
    // if(indexFrameEle) {
    //   window.addEventListener('resize', function() {
    //     indexFrameEle.style.setProperty('--vh', windowsVH + 'px');
    //   });
    // }
  };

  useEffect(() => {
    if (designFrameRef.current) {
      fitSafariHeightDesignStep();
    }
    if (indexFrameRef.current) {
      fitSafariHeightIndexStep();
    }
  }, [designFrameRef.current, indexFrameRef.current]);

  console.log("window.innerHeight", window.innerHeight);
  console.log("window.outerHeight", window.outerHeight);
  useEffect(() => {
    const inapp = new InApp(
      navigator.userAgent || navigator.vendor || window.opera
    );
    console.log("inapp", inapp);
    setUserAgent(inapp);
  }, []);

  const generatePreviewImageMiniSize = async () => {
    let node = document.querySelector(".background_img");
    let nodeSize = node.getBoundingClientRect();
    console.log("nodeSize", nodeSize);

    let textContentNode = document.querySelector(".card_design_overlay");
    let textNodeSize = textContentNode.getBoundingClientRect();
    console.log("textNodeSize", textNodeSize);

    //--------------------------------------------------------------------------
    function filter(textContentNode) {
      console.log("textContentNode", textContentNode);
      return textContentNode.className !== "background_img";
    }
    htmlToImage
      .toSvg(textContentNode, { filter: filter })
      .then(async (dataUrl) => {
        console.log("dataUrl", dataUrl);

        const svgString2Image = (svgString, width, height, format) => {
          var image = new Image();
          image.src = svgString;

          let pngData;
          image.addEventListener("load", (e) => {
            console.log("load_e", e);
            // alert("20211214_0315")
            format = format ? format : "png";
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;

            context.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);
            pngData = canvas.toDataURL("image/" + format);

            let canvasExport = document.createElement("canvas");
            let ctxExport = canvasExport.getContext("2d");
            canvasExport.width = textNodeSize.width * 2;
            canvasExport.height = textNodeSize.height * 2;

            ctxExport.clearRect(
              0,
              0,
              textNodeSize.width * 2,
              textNodeSize.height * 2
            );
            ctxExport.drawImage(
              tempCanvas,
              0,
              0,
              textNodeSize.width * 2,
              textNodeSize.height * 2
            );
            ctxExport.drawImage(
              canvas,
              0,
              0,
              textNodeSize.width * 2,
              textNodeSize.height * 2
            );
            console.log("canvasExport", canvasExport);

            let imageUrlExport = canvasExport.toDataURL("image/png");
            cardPreviewRef.current.src = imageUrlExport;

            // console.log("pngData", pngData);
            // var imagePNG = new Image();
            // imagePNG.src = pngData;
            // cardPreviewRef.current.src = pngData;
            // document.body.appendChild(imagePNG);
          });
        };

        svgString2Image(
          dataUrl,
          nodeSize.width * 2,
          nodeSize.height * 2,
          "png"
        );
      });

    // alert("20211214_2153");
  };

  const readyTheCanvas = () => {
    let template;
    if (cardTemplate === "cardA") {
      template = "tiger";
    } else {
      template = "tree";
    }
    let sourceImg = document.querySelector(`.background_img.${template}`);
    console.log("readyTheCanvas");
    console.log("sourceImg", sourceImg);
    if (sourceImg) {
      let sourceImgSize = sourceImg.getBoundingClientRect();
      console.log("sourceImgSize", sourceImgSize);

      let sourceImgUrl = sourceImg.src;

      sourceImg.crossOrigin = "anonymous";
      sourceImg.addEventListener("load", () => {
        let newCanvas = document.createElement("canvas");
        let newContext = newCanvas.getContext("2d");
        console.log("________sourceImgSize.width*2", sourceImgSize.width * 4);
        console.log("________sourceImgSize.height*2", sourceImgSize.height * 4);
        newCanvas.width = sourceImgSize.width * 4;
        newCanvas.height = sourceImgSize.height * 4;

        newContext.clearRect(
          0,
          0,
          sourceImgSize.width * 4,
          sourceImgSize.height * 4
        );
        newContext.drawImage(
          sourceImg,
          0,
          0,
          sourceImgSize.width * 4,
          sourceImgSize.height * 4
        );
        // pngData = canvas.toDataURL("image/" + format);

        console.log("________newCanvas", newCanvas);
        // document.body.appendChild(newCanvas);
        //--------------------------------------------------------------------------------------
        let fitCanvas = document.createElement("canvas");
        let fitContext = fitCanvas.getContext("2d");
        fitCanvas.width = sourceImgSize.width * 2;
        fitCanvas.height = sourceImgSize.height * 2;

        let finalFitCanvas = scaleToFit(newCanvas, fitCanvas);
        console.log("finalFitCanvas", finalFitCanvas);
        function scaleToFit(newCanvas) {
          // get the scale
          var scale = Math.min(
            fitCanvas.width / newCanvas.width,
            fitCanvas.height / newCanvas.height
          );
          // get the top left position of the image
          var x = fitCanvas.width / 2 - (newCanvas.width / 2) * scale;
          var y = fitCanvas.height / 2 - (newCanvas.height / 2) * scale;
          fitContext.drawImage(
            newCanvas,
            x,
            y,
            newCanvas.width * scale,
            newCanvas.height * scale
          );
          return fitCanvas;
        }

        setTempCanvas(finalFitCanvas);
      });
    }
  };

  const shareThisCard = async () => {
    // alert("20211214_2325")
    console.log("cardPreviewRef.current.src", cardPreviewRef.current.src);
    const imgUrl = cardPreviewRef.current.src;

    const response = await fetch(imgUrl);
    console.log("response", response);
    const blob = await response.blob();
    console.log("blob", blob);
    // const filesArray = [
    //   new File([blob], "GreetingCard.png", {
    //     type: "image/png",
    //     lastModified: new Date().getTime(),
    //   }),
    // ];
    const filesArray = [
      new File([blob], "GreetingCard.png", {
        type: blob.type,
        lastModified: new Date().getTime(),
      }),
    ];
    let shareData = {
      files: filesArray,
      title: `🎊叮叮噹~你收到了一封信✉️`,
      text: `🎊叮叮噹~你收到了一封信✉️\n點圖收祝福、看內容❣️\n想動手寫一封信給朋友嗎？！\n立馬點選網址寫信去👇👇👇\nhttps://tpenoccard.com.tw`,
    };
    let shareDataJustImage = { files: filesArray };
    if (userAgent.isMobile) {
      if (userAgent.isInApp) {
        try {
          navigator.share(shareData);
        } catch (error) {
          alert("inAppWebviewShareError" + error);
        }
      } else if (iOS) {
        console.log("iphone或ipad");
        if (iosVersion.major === 15) {
          console.log("ios 15");
          try {
            navigator.share(shareDataJustImage);
          } catch (error) {
            alert("mobileShareError" + error);
          }
        } else {
          console.log("非ios 15");
          alert("您的手機系統版本過舊，請長按賀卡圖片來進行分享！");
          // try {
          //   navigator.share(shareData);
          // } catch (error) {
          //   alert("mobileShareError" + error);
          // }
        }
      } else {
        try {
          navigator.share(shareData);
        } catch (error) {
          alert("shareError" + error);
        }
      }
    } else if (userAgent.isDesktop) {
      console.log("PC", userAgent.browser);
      try {
        // navigator.share(shareData);
        alert("電腦版請按「儲存賀卡」，就能生成圖片哦！");
      } catch (error) {
        alert("PC_ShareError" + error);
      }
    } else {
    }
  };

  const saveThisCard = () => {
    console.log("cardPreviewRef.current.src", cardPreviewRef.current.src);
    const imgUrl = cardPreviewRef.current.src;
    try {
      let a = document.createElement("a");
      a.href = imgUrl;
      a.download = `GreetingCard.png`;
      a.click();
      setTimeout(() => {
        setDownLoadSuccessShow(true);
        setTimeout(() => {
          setDownLoadSuccessShow(false);
        }, 5000);
      }, 5000);
    } catch (error) {
      console.log("download_error", error);
      alert("download_error" + error);
    }
  };

  const nextStep = () => {
    if (designStep >= 0 && designStep < 3) {
      setDesignStep((designStep) => designStep + 1);
    }
  };

  const nextStepWithPick = () => {
    if (designStep === 1) {
      setDesignStep((designStep) => designStep + 1);
      readyTheCanvas(cardTemplate);
    }
  };

  const nextStepWithCheck = () => {
    if (textAreaRef.current.value && signatureRef.current.value) {
      setDesignStep((designStep) => designStep + 1);
      if (designStep === 2) {
        // generatePreviewImage();
        generatePreviewImageMiniSize();
      }
    } else if (textAreaRef.current.value === "") {
      alert("未填寫祝福的話");
      setTextAreaPlaceholderShow(false);
      setTimeout(() => {
        textAreaRef.current.focus();
      }, 500);
    } else if (signatureRef.current.value === "") {
      alert("未填寫您的大名");
      setSignatureAreaPlaceholderShow(false);
      setTimeout(() => {
        signatureRef.current.focus();
      }, 500);
    }
  };

  const previousStep = () => {
    if (designStep === 2) {
      setDesignStep((designStep) => designStep - 1);
      setTextAreaPlaceholderShow(true);
      setSignatureAreaPlaceholderShow(true);
      textAreaRef.current.value = "";
      signatureRef.current.value = "";
    }
  };

  const designNewCard = () => {
    setDesignStep(1);
    setCardTemplate("cardA");
    setTextAreaPlaceholderShow(true);
    setSignatureAreaPlaceholderShow(true);
    textAreaRef.current.value = "";
    signatureRef.current.value = "";
    cardPreviewRef.current.src = "";
    setDownLoadSuccessShow(false);
  };

  function reportWindowSize() {
    setCurrentWindowWidth(window.innerWidth);
    setCurrentWindowHeight(window.innerHeight);
  }
  window.addEventListener("resize", reportWindowSize);

  useEffect(() => {
    if (textAreaRef.current && designStep === 2) {
      if (navigator.userAgent.indexOf("iPhone") !== -1) {
        // alert("iPhone")
        modifyFontSizeIPhone();
      } else if (userAgent.isDesktop) {
        // alert("調整font")
        modifyTextAreaFont();
        modifySignatureFont();
      }
    }
  }, [currentWindowWidth, designStep]);

  const handleChangeTextArea = (e) => {
    console.log("e", e);
    console.log('--------------------------------------------------------------------')
    let content = e.target.value;
    
      const usingSpread = [...content];
      console.log('usingSpread', usingSpread)
      const usingArrayFrom = Array.from(content);
      console.log('usingArrayFrom', usingArrayFrom)
      let contentWithCount = usingArrayFrom.map((item, index)=>{
        if(item.match(/[\u0000-\u00ff]/g)) {
          return {count:1, text: item, index:index};
        } else {
          return {count:2, text: item, index:index};
        }
      })

      console.log('contentWithCount', contentWithCount)

      let tempString = [];
      let acc = 0;
      contentWithCount.forEach((item, index)=>{
        console.log('item.count', item.count);
        if(acc < 60) {
          acc += item.count;
          tempString.push(item.text);
        } 
      })
      
      console.log('acc', acc)
      console.log('contentWithCount', contentWithCount)

      console.log('tempString', tempString)
      console.log('usingArrayFrom', usingArrayFrom)

      textAreaRef.current.value = tempString.join("");


    console.log('--------------------------------------------------------------------')

    if (textAreaRef.current) {
      if (!userAgent.isMobile) {
        modifyTextAreaFont();
      } else if (
        userAgent.isMobile &&
        navigator.userAgent.indexOf("iPhone") !== -1
      ) {
        modifyFontSizeIPhone();
      }
    }
  };

  const modifyFontSizeIPhone = () => {
    textAreaRef.current.style.fontSize = `${14}px`;
    textAreaRef.current.style.lineHeight = `${14}px`;
    textAreaPlaceholderRef.current.style.fontSize = `${14}px`;
    textAreaPlaceholderRef.current.style.lineHeight = `${14}px`;

    signatureRef.current.style.fontSize = `${12}px`;
    signatureRef.current.style.lineHeight = `${12}px`;
    signaturePlaceholderRef.current.style.fontSize = `${12}px`;
    signaturePlaceholderRef.current.style.lineHeight = `${12}px`;
  };

  const modifyTextAreaFont = () => {
    let textAreaCurrentSize = textAreaRef.current.getBoundingClientRect();
    console.log("textAreaCurrentSize", textAreaCurrentSize);

    textAreaRef.current.style.fontSize = `${
      textAreaCurrentSize.height * 0.22
    }px`;
    textAreaRef.current.style.lineHeight = `${
      textAreaCurrentSize.height * 0.32
    }px`;
    textAreaPlaceholderRef.current.style.fontSize = `${
      textAreaCurrentSize.height * 0.22
    }px`;
    textAreaPlaceholderRef.current.style.lineHeight = `${
      textAreaCurrentSize.height * 0.32
    }px`;
  };


  const handleChangeSignature = (e) => {
    console.log('--------------------------------------------------------------------')
    let content = e.target.value;
    
      const usingSpread = [...content];
      console.log('usingSpread', usingSpread)
      const usingArrayFrom = Array.from(content);
      console.log('usingArrayFrom', usingArrayFrom)
      let contentWithCount = usingArrayFrom.map((item, index)=>{
        if(item.match(/[\u0000-\u00ff]/g)) {
          return {count:1, text: item, index:index};
        } else {
          return {count:2, text: item, index:index};
        }
      })

      console.log('contentWithCount', contentWithCount)

      let tempString = [];

      let acc = 0;
      contentWithCount.forEach((item, index)=>{
        console.log('item.count', item.count);
        if(acc < 48) {
          acc += item.count;
          tempString.push(item.text);
        }
      })
      
      console.log('acc', acc)
      console.log('contentWithCount', contentWithCount)

      console.log('tempString', tempString)
      console.log('usingArrayFrom', usingArrayFrom)

      signatureRef.current.value = tempString.join("");

    if (signatureRef.current && !userAgent.isMobile) {
      modifySignatureFont();
    }
  };

  const modifySignatureFont = () => {
    let signatureCurrentSize = signatureRef.current.getBoundingClientRect();
    console.log("signatureCurrentSize", signatureCurrentSize);
    // signatureRef.current.style.fontSize = `${
    //   signatureCurrentSize.height * 0.6
    // }px`;
    // signaturePlaceholderRef.current.style.fontSize = `${
    //   signatureCurrentSize.height * 0.6
    // }px`;


    signatureRef.current.style.fontSize = `${
      signatureCurrentSize.height * 0.25
    }px`;
    signatureRef.current.style.lineHeight = `${
      signatureCurrentSize.height * 0.35
    }px`;
    signaturePlaceholderRef.current.style.fontSize = `${
      signatureCurrentSize.height * 0.25
    }px`;
    signaturePlaceholderRef.current.style.lineHeight = `${
      signatureCurrentSize.height * 0.35
    }px`;



  };

  useEffect(() => {
    if (templateFirstRef.current && cardTemplate === "cardB") {
      let firstSize = templateFirstRef.current.getBoundingClientRect();
      templateSelectorRef.current.style.transform = `translateX(${
        -firstSize.width - 30
      }px)`;
    }
  }, [designStep]);

  const swipeEventHandler = (eventData) => {
    console.log("eventData", eventData);
    let wrapSize = templateSelectorRef.current.getBoundingClientRect();
    console.log("wrapSize.width", wrapSize.width);
    let firstSize = templateFirstRef.current.getBoundingClientRect();
    console.log("firstSize", firstSize);
    if (eventData.dir === "Left") {
      templateSelectorRef.current.style.transform = `translateX(${
        -firstSize.width - 30
      }px)`;
      setCardTemplate("cardB");
    } else if (eventData.dir === "Right") {
      templateSelectorRef.current.style.transform = `translateX(0px)`;
      setCardTemplate("cardA");
    }
  };

  console.log("cardTemplate", cardTemplate);

  const handleDragStart = (e) => {
    console.log("handleDragStart_e", e);
    setDragStartClientX(e.clientX);
    let img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);
  };
  const handleDragEnd = (e) => {
    console.log("handleDragEnd_e", e);
    setDragEndClientX(e.clientX);
  };

  useEffect(() => {
    if (templateFirstRef.current && templateSelectorRef.current) {
      let firstSize = templateFirstRef.current.getBoundingClientRect();
      console.log("firstSize", firstSize);
      if (dragStartClientX - dragEndClientX > 0) {
        console.log("dragLeft");
        templateSelectorRef.current.style.transform = `translateX(${-firstSize.width}px)`;
        setCardTemplate("cardB");
      } else if (dragStartClientX - dragEndClientX < 0) {
        console.log("dragRight");
        templateSelectorRef.current.style.transform = `translateX(0px)`;
        setCardTemplate("cardA");
      } else {
        console.log("noDrage");
      }
    }
  }, [dragStartClientX, dragEndClientX]);

  // const handleTextCount = (e) => {
  //   let content = e.target.value;
  //   console.log('handleTextCount_content', content)
  //     var arr = content.match(/[^\x00-\xff]/ig); 
  //     return  arr == null ? this.length : this.length + arr.length; 
  // }

  const handleRenderTextInputElement = (cardTemplate) => {
    return (
      <Fragment>
        {/* <img
          className="background_img"
          src={cardTemplate === "cardA" ? cardTemplateA : cardTemplateB}
        /> */}
        <div className="textarea_wrap">
          <div
            className={`textarea_placeholer ${
              textAreaPlaceholderShow ? "" : "hidden"
            }`}
            ref={textAreaPlaceholderRef}
          >
            這裡至多可以輸入30個字哦！選下一步後，點儲存賀卡即可下載！
          </div>
          <textarea
            id={`textArea`}
            className={`${isIPhone ? "iphone_area" : ""}`}
            type="text_area"
            // maxLength="30"
            rows="3"
            spellCheck="false"
            ref={textAreaRef}
            onChange={(e) => handleChangeTextArea(e)}
            onFocus={() => setTextAreaPlaceholderShow(false)}
          ></textarea>
        </div>
        <div className="signature_wrap">
          <div
            className={`signature_placeholer ${
              signatureAreaPlaceholderShow ? "" : "hidden"
            } ${
              cardTemplate === "cardA" ? "tiger" : "tree"
            }
            `}
            ref={signaturePlaceholderRef}
          >
            請在這裡輸入送件者大名！<br/>
            請在這裡輸入送件者大名！
          </div>

          <textarea
            type="text"
            id={`signatureArea`}
            className={`signature ${
              cardTemplate === "cardA" ? "tiger" : "tree"
            } ${isIPhone ? "iphoneSignature" : ""}`}
            ref={signatureRef}
            // maxLength={12}
            // size="10"
            rows="2"
            spellCheck="false"
            onChange={(e) => handleChangeSignature(e)}
            onFocus={() => setSignatureAreaPlaceholderShow(false)}
            // onInput={(e)=> handleSignatureInput(e)}
            autoComplete="off"
          ></textarea>
        </div>
      </Fragment>
    );
  };
  const handleTigerTooltipShow = (e) => {
    e.stopPropagation();
    let wrap = document.querySelector(".card_template.tiger");
    let wrapSize = wrap.getBoundingClientRect();
    console.log("wrapSize", wrapSize);
    console.log("滑鼠移動");
    console.log("e", e);
    console.log("e.clientX", e.clientX);
    console.log("e.clientY", e.clientY);
    var x = e.clientX - wrapSize.x + 20;
    var y = e.clientY - wrapSize.y + 20;
    let tooltipTigerEle = document.getElementById("tooltipTiger");
    let tooltipTigerEleSize = tooltipTigerEle.getBoundingClientRect();
    console.log("tooltipTigerEleSize", tooltipTigerEleSize);
    if (x < wrapSize.width-wrapSize.width*0.2) {
      tooltipTigerEle.style.left = x + "px";
    } else {
      tooltipTigerEle.style.left = x - tooltipTigerEleSize.width - 20 + "px";
    }
    tooltipTigerEle.style.top = y + "px";
  };

  const handleTreeTooltipShow = (e) => {
    let wrap = document.querySelector(".card_template.tree");
    let wrapSize = wrap.getBoundingClientRect();
    console.log("wrapSize", wrapSize);
    console.log("滑鼠移動");
    console.log("e", e);
    console.log("e.clientX", e.clientX);
    console.log("e.clientY", e.clientY);
    var x = e.clientX - wrapSize.x + 20;
    console.log("x", x);
    var y = e.clientY - wrapSize.y + 20;
    console.log("y", y);
    let tooltipTreeEle = document.getElementById("tooltipTree");
    let tooltipTreeEleSize = tooltipTreeEle.getBoundingClientRect();
    console.log("tooltipTreeEleSize", tooltipTreeEleSize);
    if (x < wrapSize.width-wrapSize.width*0.2) {
      tooltipTreeEle.style.left = x + "px";
    } else {
      tooltipTreeEle.style.left = x - tooltipTreeEleSize.width - 20 + "px";
    }
    tooltipTreeEle.style.top = y + "px";
  };
  return (
    <div className="card_container" ref={cardContainerRef}>
      <div className="card_workspace">
        {designStep === 0 ? (
          <div className="index_frame" ref={indexFrameRef}>
            <div className="index_frame_overlay">
              <div
                className="enter_stamp"
                onClick={() => setDesignStep(1)}
              ></div>
            </div>
          </div>
        ) : (
          <div className="design_frame" ref={designFrameRef}>
            <div className="design_step">
              {designStep === 1 ? (
                <div className={`step_row step1`}></div>
              ) : null}
              {designStep === 2 ? (
                <div className={`step_row step2`}></div>
              ) : null}
              {designStep === 3 ? (
                <div className={`step_row step3`}></div>
              ) : null}
            </div>
            {designStep === 1 ? (
              <Swipeable onSwiped={(eventData) => swipeEventHandler(eventData)}>
                <div
                  className="card_template_select_area"
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e)}
                  onDragEnd={(e) => handleDragEnd(e)}
                >
                  <div className="card_template_wrap" ref={templateSelectorRef}>
                    <div className="card_template_wrap_overlay">
                      <div className="card_template_box">
                        <div
                          className="card_template tiger"
                          ref={templateSecondRef}
                          onMouseMove={(e) => handleTigerTooltipShow(e)}
                        >
                          <div id="tooltipTiger">
                            按住滑鼠左鍵，往左滑可選聖誕賀卡。
                          </div>
                        </div>
                        <div
                          className="card_template tree"
                          ref={templateFirstRef}
                          onMouseMove={(e) => handleTreeTooltipShow(e)}
                        >
                          <div id="tooltipTree">
                            按住滑鼠左鍵，往右滑可選虎年賀卡。
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Swipeable>
            ) : null}
            <div
              className={`card_area ${
                designStep === 2 || designStep === 3 ? "display" : "hidden"
              }`}
            >
              <div className={`card_design_area`}>
                <div className="card_design_border"></div>

                <div className={`card_design_overlay`}>
                  <img
                    className={`background_img tiger ${
                      cardTemplate === "cardA"
                        ? "tiger_display"
                        : "tiger_hidden"
                    }`}
                    src={cardTemplateA}
                  />
                  <img
                    className={`background_img tree ${
                      cardTemplate !== "cardA" ? "tree_display" : "tree_hidden"
                    }`}
                    src={cardTemplateB}
                  />
                  {handleRenderTextInputElement(cardTemplate)}
                </div>

                <img
                  className={`card_design_preview ${
                    designStep === 3 ? "display_preview" : ""
                  }`}
                  ref={cardPreviewRef}
                ></img>
              </div>
            </div>

            <div className="bottom_button_area">
              <div className="logo"></div>
              {/* <div className="button_wrap"> */}
              {designStep === 1 ? (
                <div
                  className="bottom_btn next_btn"
                  onClick={nextStepWithPick}
                ></div>
              ) : null}
              {designStep === 2 ? (
                <Fragment>
                  <div
                    className="bottom_btn previous_btn"
                    onClick={previousStep}
                  ></div>
                  <div
                    className="bottom_btn next_btn"
                    onClick={nextStepWithCheck}
                  ></div>
                </Fragment>
              ) : null}
              {designStep === 3 ? (
                <Fragment>
                  <div
                    className="bottom_btn reset_card_btn"
                    onClick={designNewCard}
                  ></div>
                  <div
                    className="bottom_btn save_btn"
                    onClick={saveThisCard}
                  ></div>
                  <div
                    className="bottom_btn share_btn"
                    onClick={shareThisCard}
                  ></div>
                </Fragment>
              ) : null}
            </div>
            {/* </div> */}
          </div>
        )}
      </div>
      {downLoadSuccessShow ? (
        <div className="card_container_overlay">
          <div className="download_complate"></div>
        </div>
      ) : null}
    </div>
  );
};

export default Card;
