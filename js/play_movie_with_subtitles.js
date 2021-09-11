function st_sub(){
    document.getElementById('file').addEventListener('change', handleFileSelect, false);
}

function sleep(second) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, second * 1000)
    })
}

//******************************* srt file time style changer ***********************************
function sec_calc(str_mat2){
    i_hh=str_mat2.substring(0,2)
    i_mm=str_mat2.substring(3,5)
    i_ss=str_mat2.substring(6,8)
    i_ms=str_mat2.substring(9,12)
    str_sec=(parseInt(i_hh*3600)+parseInt(i_mm*60)+parseInt(i_ss))+"."+(i_ms)
    int_sec=str_sec
    return int_sec
}

/**********************************/
async function handleFileSelect(ev){
    var reader = new FileReader();
    for (let i = 0; i < ev.target.files.length; i++) {
        let file = ev.target.files[i];
        s_name=file.name
        splt=s_name.split(".")
        if(splt[1]!="srt"){
            v.src = URL.createObjectURL(file);
            await sleep(1)
            v.load()
            await sleep(1)
            v.play()
            reader.onload = function(evt) {
                var subtitles;
                let subtitle = evt.target.result;
                _subtitle(subtitle);
            }
        }
    }


    for (let i = 0; i < ev.target.files.length; i++) {
        let file = ev.target.files[i];
        s_name=file.name
        splt=s_name.split(".")
        if(splt[1]=="srt"){
            reader.readAsText(file,"Shift_JIS");
        }
    }    



};

//**************************** display subtitle **************************************
function _subtitle(text) {
    let Subtitle = text;
    let Pattern = /(\d+)\n([\d:,]+)\s+-{2}\>\s+([\d:,]+)\n([\s\S]*?(?=\n{2}|$))/g;
    let _regExp = new RegExp(Pattern);
    if (typeof (text) != "string") throw "Sorry, Parser accept string only.";
    if (Subtitle === null) return Subtitle;
    let Parse = Subtitle.replace(/\r\n|\r|\n/g, '\n');
    let Matches;
    //*************//
    v.addEventListener("timeupdate", function(){
    document.getElementById("subtitle").style.top = document.getElementById("subtitles_position").value+"%";
    document.getElementById("subtitle").style.fontSize = document.getElementById("fnt_siz").value+"px";
    while ((Matches = Pattern.exec(Parse)) != null) {
        int_start_sec=sec_calc(Matches[2])
        int_end_sec=sec_calc(Matches[3])
        int_v_time=v.currentTime+parseFloat(document.getElementById("delay").value)
        if(int_v_time > parseFloat(int_start_sec)){
        if(int_v_time < parseFloat(int_end_sec)){
            document.getElementById("subtitle").innerHTML = Matches[4].replace('\n','<br />');
        }
        if(int_v_time > parseFloat(int_end_sec)){
            document.getElementById("subtitle").innerHTML = "";
        }
        }
    }
    },false);
}