const raw = [
  // Anarchism & libertarianism
  "Anarchism", "Anarcha-feminism", "Anarcho-capitalism", "Anarcho-syndicalism",
  "Green anarchism", "Individualist anarchism", "Social anarchism", "Free-market anarchism",
  "Crypto-anarchism", "National-anarchism", "Religious anarchism", "Islamic anarchism",
  "Jewish anarchism", "Mutualism|Mutualism (economic theory)", "Communalism|Communalism (Bookchin)",
  "Left-libertarianism", "Libertarian communism", "Libertarian socialism", "Geolibertarianism",
  "Minarchism", "Panarchism|Panarchy (political philosophy)", "Voluntaryism",
  "Technolibertarianism", "Autarchism", "Libertarian paternalism",
  // Ecology
  "Neo-Luddism", "Bioregionalism", "Ecocentrism", "Radical environmentalism",
  "Eco-socialism", "Eco-feminism", "Eco-nationalism", "Green conservatism", "Ecoauthoritarianism",
  // Marxism & communisms
  "Trotskyism", "Maoism", "Hoxhaism", "Juche", "Titoism", "Stalinism", "Leninism",
  "Left communism", "Autonomism", "Open Marxism", "Austro-Marxism", "Frankfurt School",
  "Freudo-Marxism", "Hegelian Marxism", "Marxist humanism", "Neo-Marxism", "Post-Marxism",
  "Western Marxism", "Libertarian Marxism", "Bordigism", "Blanquism", "Guevarism", "Castroism",
  "Ceaușism", "Kadarism", "Husakism", "Khrushchevism", "Brezhnevism", "Mao-Spontex",
  "De Leonism", "Impossibilism", "Classical Marxism", "Vanguardism", "Nechayevism",
  "Tkachevism", "National Bolshevism", "National communism", "Dubčekism|Socialism with a human face",
  "War socialism|War communism",
  // Socialisms
  "Market socialism", "Guild socialism", "Utopian socialism", "Ethical socialism",
  "Municipal socialism", "Agrarian socialism", "African socialism", "Arab socialism",
  "Liberal socialism", "Millennial socialism", "Proto-socialism", "Third camp socialism",
  "Socialism of the 21st century", "Socialist feminism", "Democratic socialism",
  "Social democracy", "Labourism", "Reformism", "Barracks socialism", "Marhaenism", "Ba'athism",
  // Conservatism & the right
  "Bioconservatism", "Black conservatism", "Civic conservatism", "Classical conservatism",
  "Conservative corporatism", "Cultural conservatism", "Fiscal conservatism", "Left-conservatism",
  "Liberal conservatism", "Libertarian conservatism", "LGBT conservatism", "National conservatism",
  "Neoconservatism", "Paleoconservatism", "Paternalistic conservatism", "Social conservatism",
  "Theoconservatism", "Traditionalist conservatism", "Illiberalism", "Integralism", "Irredentism",
  "Monarchism", "Neo-feudalism", "Neo-nationalism", "Neo-reactionary movement",
  "Reactionary modernism", "Revanchism", "Theocracy", "Dark Enlightenment", "Nouvelle Droite",
  "Third Position", "Conservative revolutionary movement", "Distributism", "Whiggism",
  "Old Right|Old Right (United States)",
  // Democracy & governance
  "Associative democracy", "Bioregional democracy", "Cellular democracy", "Liquid democracy",
  "Participatory democracy", "Deliberative democracy", "Direct democracy", "Radical democracy",
  "Economic democracy", "Council democracy", "Inclusive Democracy", "Sovereign democracy",
  "Guided democracy", "Consensus democracy", "Delegative democracy", "Grassroots democracy",
  "Cosmopolitan democracy", "Defensive democracy", "E-democracy", "Tory democracy",
  "Pirate politics", "Cyber-utopianism", "Open-source governance", "Producerism",
  "Localism|Localism (politics)", "Anti-establishmentarianism",
  // Authoritarian & other systems
  "Absolute monarchism|Absolute monarchy", "Autocracy", "Despotism", "Dictatorship",
  "Kraterocracy", "Managerial state", "Ochlocracy", "Oligarchy", "Plutocracy", "Police state",
  "Soft authoritarianism", "Totalitarianism", "Digital authoritarianism", "Authoritarian capitalism",
  "Byzantinism", "Minoritarianism", "Unitarism|Political unitarism",
  // Feminisms
  "Cyberfeminism", "Radical feminism", "Intersectional feminism", "Difference feminism",
  "Lesbian feminism", "Libertarian feminism", "Lipstick feminism", "Sex-positive feminism",
  "Separatist feminism", "Standpoint feminism", "State feminism", "Transfeminism",
  "Gender-critical feminism", "Maternal feminism", "Material feminism", "Conservative feminism",
  "Individualist feminism", "Labor feminism", "Islamic feminism", "Jewish feminism",
  // Liberalisms
  "Neoclassical liberalism", "Social libertarianism", "Liberal internationalism",
  "Radicalism|Radicalism (historical)", "Constitutionalism", "Liberal corporatism",
  "Liberal autocracy", "Liberal transhumanism|Democratic transhumanism", "Liberal nationalism|National liberalism",
  // Nationalisms & pan-movements
  "Civic nationalism", "Cultural nationalism", "Economic nationalism", "Ethnic nationalism",
  "Expansionist nationalism", "Homonationalism", "Integral nationalism", "Left-wing nationalism",
  "Queer nationalism", "Radical nationalism", "Revolutionary nationalism", "Romantic nationalism",
  "Territorial nationalism", "Ultranationalism", "Postnationalism", "National populism",
  "National syndicalism", "National capitalism", "National mysticism",
  "Nativism|Nativism (politics)", "Patriotism", "Sovereignism|Souverainism", "Chauvinism",
  "Communitarianism", "Euroscepticism", "Eurasianism", "Indigenism", "Multiculturalism",
  "Regionalism|Regionalism (politics)", "Continentalism", "Neo-Sovietism", "Yugoslavism",
  "Czechoslovakism", "Pan-Africanism", "Pan-Arabism", "Pan-Asianism", "Pan-Celticism",
  "Pan-Europeanism", "Pan-Germanism", "Pan-Islamism", "Pan-Latinism", "Pan-Slavism",
  "Pan-Turkism", "Pan-Iranism", "Pan-Americanism", "Pan-Iberism", "Pan-Hispanism",
  "Pan-Somalism", "Pan-Mongolism", "Pan-Albanianism", "Pan-Finnicism", "Pan-Scandinavianism",
  // Populism
  "Left-wing populism", "Right-wing populism", "Authoritarian populism", "Market populism",
  "Penal populism", "Socialist populism", "Völkisch movement", "Demagogy",
  // Religion & politics
  "Clericalism", "Complementarianism", "Confessionalism|Confessionalism (politics)", "Messianism",
  "Millenarianism", "Political religion", "Secularism", "Spiritual left", "State religion",
  "Caesaropapism", "Christian democracy", "Christian left", "Christian right",
  "Christian egalitarianism", "Christian humanism", "Christian pacifism", "Jesuism",
  "Political Catholicism", "Islamism", "Islamic modernism", "Islamic socialism",
  "Islamic democracy", "Jewish left", "Jewish Autonomism", "Bundism", "Canaanism",
  "Zionism", "Labor Zionism", "Revisionist Zionism", "Post-Zionism", "Religious anti-Zionism",
  "Humanism", "Freemasonry", "Anti-Masonry", "Gülen movement", "Hindu-Muslim unity", "Kibbutzim",
  // Movements & other ideas
  "Anti-consumerism", "Anti-globalization movement", "Anti-nuclear movement",
  "Anti-corruption", "Anti-copyright", "Civil libertarianism", "Free speech movement",
  "Net neutrality", "Occupy movement", "Peace movement", "Labour movement", "Egalitarianism",
  "Copyleft", "Anti-austerity movement", "Parecon|Participatory economics",
  "Parpolity|Participatory politics", "Syndicalism", "Laissez-faire", "Anti-imperialism",
  "Trumpism", "Reaganism", "Tea Party movement", "McCarthyism", "Anti-intellectualism",
  // Pour ajouter un courant : une ligne ici, ex. "Anarcho-primitivism",
];

export const ideologies = raw.map((entry) => {
  const [name, page] = entry.split("|");
  const slug = (page || name).replaceAll(" ", "_");
  return { name, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(slug)}` };
});