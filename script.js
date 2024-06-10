document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const closeModal = document.getElementsByClassName('close-btn')[0];

  const productDescriptions = {
    'Том Ям': 'Острый и насыщенный суп Том Ям с кальмаром, лососем и креветками.',
    'Борщ': 'Классический борщ, приготовленный по традиционному рецепту.',
    'Салат цезарь с курицей': 'Салат цезарь с курицей - классическое блюдо с сочной курицей, свежими овощами и хрустящими крутонами.',
    'Салат калифорния': 'Салат калифорния - легкий и питательный салат с разнообразием свежих ингредиентов.',
    'Наггетсы': 'Вкусные и сочные наггетсы, приготовленные из лучшего куриного филе.',
    'Картофель фри': 'Хрустящий картофель фри, обжаренный до золотистой корочки.',
    'Картофельные дольки': 'Аппетитные картофельные дольки, приправленные специями.',
    'Креветки в темпуре с васаби': 'Креветки в хрустящей темпуре с пикантным соусом васаби.',
    'Карбонара': 'Лапша Карбонара - итальянское блюдо с ароматным соусом карбонара и беконом.',
    'Тяхан с курицей': 'Лапша Тяхан с курицей - традиционное блюдо азиатской кухни с курицей и овощами.',
    'Удон с курицей': 'Лапша Удон с курицей - японское блюдо с толстой лапшой удон и кусочками курицы.',
    'Соба с курицей': 'Лапша Соба с курицей - японское блюдо с тонкой лапшой соба и кусочками курицы.',
    'Тяхан с креветками': 'Лапша Тяхан с креветками - азиатское блюдо с лапшой и креветками в соусе.',
    'Соба с креветками': 'Лапша Соба с креветками - японское блюдо с тонкой лапшой соба и креветками.',
    'Удон с креветками': 'Лапша Удон с креветками - японское блюдо с толстой лапшой удон и креветками.',
    'Филадельфия классика': 'рис, нори, сыр, огурец, лосось, васаби, имбирь, соевый соус',
    'Филадельфия с угрем': 'рис, нори, сыр, огурец, угорь, васаби, имбирь, соевый соус',
    'Филадельфия с креветкой': 'рис 120г, нори 0,5г, сыр 50г, огурец 30г, креветка 50г, васаби 5г, имбирь 15г, соевый соус 30г',
    'Ролл золотая филадельфия':'рис ,нори ,авокадо, дайкон, омлет, лосось, кальмар, угорь, золото, икра, том ям',
    'Ролл с поп корном из риса':'нори, авокадо, тунец, лосось, краб, джем, кляр, попкорн из риса, терияки, васаби, имбирь, соевый соус',
    'Калифорния классика':'рис, нори, снежный краб, огурец, авокадо, спайси соус, тобико, васаби, имбирь, соевый соус',
    'Калифорния с лососем':'рис, нори, авокадо, огурец, лосось, тобико,сыр, васаби, имбирь, соевый соус',
    'Калифорния с кунжутом':'рис, нори, снежный краб, огурец, кунжут, васаби, имбирь, соевый соус',
    'Канада':'рис, нори, сыр, лосось, авокадо, угорь, унаги, кунжут, васаби, имбирь, соевый соус',
    'Сочный бекон':'рис нори, курица, сыр, огурец, масаго, тунец, терияки, васаби, имбирь, соевый соус',
    'Опаленный лосось':'рис, нори, кларий, спайси соус, авокадо, лосось, тобико, унаги, лук зеленый, васаби, имбирь, соевый соус',
    'Цезарь с курицей':'рис, соус цезарь, курица зап., романа, нори, помидор, пармезан, кунжут, васаби, имбирь, соевый соус',
    'Жаренный цезарь с курицей':'рис, нори, соус цезарь, романо, курица, помидор, сухари панко, кляр, унаги, кунжут, васаби, имбирь, соевый соус',
    'Жаренный с креветкой':'рис, нори, сыр, креветка, авокадо, васаби, имбирь, соевый соус, панко, кляр, унаги, кунжут',
    'Жаренный с лососем':'рис, нори, сыр, лосось, авокадо, васаби, имбирь, соевый соус, панко, кляр, унаги, кунжут',
    'Жаренный с угрем':'рис, нори, сыр, кларий, авокадо, васаби, имбирь, соевый соус, панко, кляр, унаги, кунжут',
    'Жаренный с крабом':'Нори, рис, снежный краб, сливочный сыр',
    'Жаренный с беконом':'рис, нори, бекон, курица, сыр, унаги, кунжут, кляр, сухари, васаби, имбирь, соевый соус',
    'Жаренный с кальмаром':'Нори, рис, кальмар, сливочный сыр',
    'Мини ролл с огурцом':'рис, нори, огурец, васаби, имбирь, соевый соус',
    'Мини ролл с авокадо':'рис, нори, авокадо, васаби, имбирь, соевый соус',
    'Мини ролл с дайконом':'рис, нори, дайкон маринованный, васаби, имбирь, соевый соус',
    'Мини ролл с лососем':'рис, нори, лосось, васаби, имбирь, соевый соус',
    'Мини ролл с угрем':'рис, нори, угорь, васаби, имбирь, соевый соус',
    'Мини ролл с тунцом':'рис, нори, тунец, васаби, имбирь, соевый соус',
    'Чиз маки с тунцом':'рис, нори, тунец, сыр, огурец, васаби, имбирь, соевый соус',
    'Чиз маки с угрем':'рис, нори, сыр, угорь, огурец, васаби, имбирь, соевый соус',
    'Чиз маки с лососем':'рис, нори, сыр, лосось, огурец, васаби, имбирь, соевый соус',
    'Ясай с дайконом':'рис, нори, ротано, дайкон маринованный, перец болгарский, васаби, имбирь, соевый соус',
    'Запеченый с лососем':'рис, нори, сыр, лосось, желтый майонез, кунжут, васаби, имбирь, соевый соус',
    'Запеченый с угрем':'рис, нори, сыр, омлет, угорь, унаги, кунжут, васаби, имбирь, соевый соус',
    'Запеченый с курицей':'рис, нори,сыр, курица, соус спайс, васаби, имбирь, соевый соус',
    'Запеченый цезарь':'рис, нори, сыр, курица, соус цезарь, пармезан, кунжут, васаби, имбирь, соевый соус',
    'Запеченый с крабом':'рис, нори,сыр, снежный краб, соус спайс, васаби, имбирь, соевый соус',
    'Бонито кальмар':'рис, нори, сыр, кальмар, огурец, стружка тунца, васаби, имбирь, соевый соус',
    'Бонито тунец':'рис, нори, сыр, тунец, огурец, стружка тунца, васаби, имбирь, соевый соус',
    'Тунец терияки':'нори, рис, сыр сливочный, огурец, тунец, соус терияки, сено лука порея , нити чили, кунжут',
    'Нежный лосось':'рис, нори, лосось, омлет, сыр, кунжут, васаби, имбирь, соевый соус',
    'Нежный опаленный лосось':'рис, нори,сыр,огурец, лосось, спайс соус, омлет, унаги, васаби, имбирь, соевый соус',
    'Нежный опаленный угорь':'рис, нори, огурец, угорь, спайс соус, омлет, сыр, унаги, васаби, имбирь, соевый соус',
    'Опаленный кальмар лайт':'рис, нори,сыр, огурец, кальмар,унаги, лук зелёный, васаби, имбирь, соевый соус',
    'Сет вегетарианский':'5 роллов - мини ролл с огурцом, мини с авокадо, мини с дайконом, ролл вегетарианский, ясай',
    'Сет популярный':'6 роллов:Филадельфия классическая,Филадельфия с креветкой,жаренный с креветкой,жаренный цезарь,запечённый с крабом,чиз мак с лососем',
    'Сет мини':'6 мини роллов - авокадо, огурец, дайкон, лосось, угорь, тунец',
    'Сет филадельфия':'3 филы- классика, с угрем, с креветкой',
    'Сет япошка':'4 ролла, запеченный с курицей, жаренный с крабом, калифорния с крабом, филадельфия лайт',
    'Сет теплый':'4 ролла - жаренный с беконом, жаренный с кальмаром, жареный с крабом, запеченный с крабом',
    'Сет запеченный':'5 запеченных роллов: c курицей, крабом, лососем, угрем и цезарь',
    'Сет токио':'6 роллов: нежный лосось, бонито тунец, опаленный кальмар, жареный цезарь, запеченный цезарь, запеченный краб',
    'Сет весна':'4 ролла, калифорния с кунжутом, бонито кальмар, чиз маки с тунцом, ясай',
    'Сет самурай':'4 ролла - бонито тунец, сочный бекон, тунец терияки, нежный лосось',
    'Сет азия':'4 ролла - опаленный кальмар лайт, опаленный лосось, опаленный угорь, чиз мак с лососем',
    'Мини чебуреки с курицей':'Мини чебуреки с курицей 500гр',
    'Вареники со свининой':'Вареники со свининой 500гр',
    'Вареники с говядиной':'Вареники с говядиной 500гр',
    'Пельмени со свининой':'Пельмени со свининой 500гр',
    '4 сыра':'Пицца с кедровыми орешками, соусом песто и сырами: сыр с плесенью, чеддер, моцарелла, сулугуни',
    'Пепперони':'Пицца с пикантными колбасками пепперони, томатным соусом и сыром моцарелла',
    'Ветчина/грибы':'Пицца с ветчиной, вешенками, моцареллой и томатным соусом',
    'Маргарита':'Пицца Маргарита со сладкими розовыми томатами, сыром моцарелла и соусом песто',
    'Бургер с мраморной говядиной':'Бургер с котлетой из мраморной говядины, плавленным сыром и фирменным соусом гриль'
  };

  document.querySelectorAll('.product-card img').forEach(img => {
    img.addEventListener('click', (event) => {
      const productCard = event.target.closest('.product-card');
      const productName = productCard.dataset.name;

      modalTitle.innerText = productName;
      modalDescription.innerText = productDescriptions[productName];

      modal.style.display = 'block';
    });
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
