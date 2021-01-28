var dog,sadDog,happyDog;
var feed, addFood, nameInp, nameSubmit;
var storeName;
var resetB;

var foodS, db;
var lastFed;


function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happydog.png");
  milk = loadImage("Images/Milk.png");
}

function setup() {
  createCanvas(1000,400);

  db = firebase.database();
  db.ref("foodStock").on("value", function(data) {
    foodS = data.val();
  });
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton("Feed Dog");
  feed.position(1100, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(1020, 95);
  addFood.mousePressed(foodSupply);

  nameInp = createInput().attribute("placeholder", "Dog's Name");
  nameInp.position(220, 95);
  nameSubmit = createButton("Submit");
  nameSubmit.position(400, 95);
  nameSubmit.mousePressed(submit);

  resetB = createButton("Reset");
  resetB.position(680, 450);
  resetB.mousePressed(reset);
}

function draw() {
  var x=50;
  var y=50;

  background(46,139,87);
  drawSprites();
  fill("white");
  textSize(24);
  text(foodS, 500, 200);

  if(foodS!=0) {
    for(var i = 0; i<foodS; i++){
      if(i%10===0) {
        x = 50;
        y+=60;
      }
      image(milk, x, y, 50, 50);
      x+=30;
    }
  }

  if(storeName!=null) {
    fill("white");
    textSize(24);
    text(storeName, 765, 290);
  }

  if(lastFed!=undefined) {
    if(lastFed>11) {
      textAlign(CENTER);
      text("Last Fed : " + lastFed + "PM", 500, 40);
    } else {
      textAlign(CENTER);
      text("Last Fed : " + lastFed + "PM", 500, 40);
    }
  }
}

function feedDog() {
  if(foodS>0) {
    foodS-=1;
    db.ref("/").update({foodStock:foodS, feedTime:hour()});
    db.ref("feedTime").on("value", function(data){
      lastFed = data.val();
    })
  }
}

function foodSupply() {
  if(foodS<40) { 
    foodS++;
    db.ref("/").update({foodStock:foodS});
  }
}

function submit() {
  storeName = nameInp.value();
  db.ref("/").update({
    name:storeName
  })
  nameInp.hide();
  nameSubmit.hide();
}

function reset() {
  foodS = 0;
  storeName = "";
  lastFed = undefined;
  db.ref("/").update({foodStock:foodS, name:storeName});
  window.location.reload();
}
