<template>
  <footer>
    <div class="footer-content">

        <div class="footer-section">
            <h4>Légal & Contact</h4>
            <ul>
            <p>+60 123 456 789</p>
            <li><a href="mailto:contact@poliyvalues.com">Nous contacter par mail</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <ul>
                <h4>Suivez-nous</h4>
                <div class="flexbox">
                    <img src="../assets/img/Facebook_logo.png" alt="Facebook Logo" >
                    <p> Facebook</p>
                </div>
                <div class = "flexbox">
                    <img src="../assets/img/Instagram_logo.png" alt="Instagram Logo">
                    <p> Instagram</p>
                </div>
                <div class = "flexbox">
                    <img src="../assets/img/WhatsApp_logo.png" alt="WhatsApp Logo">
                    <p> WhatsApp</p>
                </div>
                
            
            </ul>
        </div>
      

      <div class="footer-section">
        <h4>Our Insipiration</h4>
        <ul>
           <div class="flexbox">
                <a href="https://politiscales.party/" target="_blank" rel="noopener noreferrer">
                    <img src="../assets/img/Politiscales_logo.png" alt="Politiscales Logo">
                </a>
                <a href="https://politiscales.party/" target="_blank" rel="noopener noreferrer"> Politiscales</a>
            </div>

            <div class="flexbox">
                <a href= "https://8values.cc/?lang=en" target="_blank" rel="noopener noreferrer">
                    <img src="../assets/img/8_Values_logo.png" alt="8 Values Logo">
                </a>
                <a href="https://8values.cc/?lang=en" target="_blank" rel="noopener noreferrer"> 8 Values</a>
            </div>

        </ul>
      </div>

      <div class="footer-section">
        <h4>Your Data :</h4>
          <ul>
              <li title="Vos données sont stockées sur un serveur privé, sécurisé et Européen.">Localisation</li>
              <li title="Vos données servent uniquement à générer vos résultats, sans revente à des tiers.">Utilisation</li>
          </ul>
        

      </div>

      


      

    </div>
    
    <div class="footer-bottom">
      <p> &copy; 2026 PoliyValues. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<style scoped>

footer {
  background-color: #2c3e50; /* Couleur de fond sombre */
  color: #ecf0f1;           /* Texte clair */
  padding: 2rem 1rem 0.5rem;
  font-family: sans-serif;
  margin-top: 2vw;
}

.flexbox {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 0.5rem;
}

.flexbox img {
  margin-right: 0.5rem;
  width: 25px;
  height: 25px;
}

.footer-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
}

.footer-section {
  margin-bottom: 1.5rem;
  min-width: 220px;
}

.footer-section h4 {
  color: #42b983; /* Vert caractéristique de Vue.js */
  border-bottom: 2px solid #34495e;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.footer-section a:hover {
  color: #42b983;
}

.footer-bottom {
  text-align: center;
  border-top: 1px solid #34495e;
  padding-top: 1rem;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #7f8c8d;
}

li[title] {
  position: relative;
  cursor: help;
}
</style>