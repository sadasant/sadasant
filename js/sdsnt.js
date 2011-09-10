var _json = {
  about: "I have 20 years old. I enjoy being an autodidact. I like humanity and science. I believe hatred grows as communications crumble. I love how everything is uncertain. I live at Venezuela, but I enjoy traveling. I work for my own and do IT for fun. I like to dive minds, solitude, partnership and projects.",
  music: "",
  writes: "",
  draws: "",
  foss: ""
}

$.ajax({
  type:"POST",
  url: '/echo/json/',
  data: { json:JSON.stringify(_json) },
  success: function(json) {
    $("#content").html("<p>"+json["about"]+"</p></br>");
  }
});

