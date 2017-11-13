(function() {
  "use strict";

  window.prestoEmbedTool = window.prestoEmbedTool || {
    config: {
      iframeDefaultStyles: {
        display: "block",
        border: 0,
        width: "100%",
        height: "500px"
      }
    },
    embeds: [],
    setEmbeds: function(embed) {
      this.embeds.push(embed);
    },
    getEmbed: function(url){
        for(var i=0, f = this.embeds.length;i<f;i++){
            if (this.embeds[i].url === url){
                return this.embeds[i];
            }
        }
    },
    bootstrap: function() {
      //Look for all script tags with 'data-presto-embed' attribute
      var embeds = document.querySelectorAll("script[data-presto-embed]");
      for (var i = 0; i < embeds.length; i++) {
        var url = embeds[i].getAttribute("data-presto-embed");
        var customStyles = this.getCustomStyles(embeds[i]);
        var element = this.createIframe(url);

        //Store embed in our scope
        this.setEmbeds({
          url: url,
          customStyles: customStyles,
          element: element
        });

        //Remove the 'data-presto-embed' so it's not queried again
        embeds[i].removeAttribute("data-presto-embed");

        //Append the iframe element
        embeds[i].parentNode.insertBefore(element, embeds[i].nextSibling);
      }

      if (this.embeds.length === 1) {
        //this.createListener();
      }
    },
    createIframe: function(src, customStyles) {
      var iframe = document.createElement("iframe");
      iframe.src = src;

      //Apply default style settings to this element
      for (var key in this.config.iframeDefaultStyles) {
        iframe.style[key] = this.config.iframeDefaultStyles[key];
      }

      //Apply custom styles to the iframe if present
      for (var key in customStyles) {
        iframe.style[key] = customStyles[key];
      }

      return iframe;
    },
    createListener: function() {
      window.addEventListener(
        "message",
        this.handleMessages.bind(undefined, this.createdElements),
        false
      );
    },
    handleMessages: function(createdElements, e) {
      var targets = createdElements;
      if ("target" in e.data) {
        if (e.data.target !== "*") {
          targets = [e.data.target];
        }
      }
      if ("height" in e.data) {
        for (var i = 0, f = targets.length; i < f; i++) {
          var uid = createdElements.indexOf(targets[i]);
          var el = document.querySelectorAll(
            ".presto-embed-tool[data-embed-id='" + uid + "']"
          );
          if (el.length > 0) {
            el[0].style.height = e.data.height + "px";
          }
        }
      }
    },
    getCustomStyles: function(el) {
      var customStyle = el.hasAttribute("data-embed-style")
        ? el.getAttribute("data-embed-style")
        : "{}";
      customStyle = customStyle.replace(/'/g, '"');
      return JSON.parse(customStyle);
    }
  };
  prestoEmbedTool.bootstrap();
})();
