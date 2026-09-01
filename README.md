# Mon Bazar

Marketplace mobile de seconde main pour le Bénin (Cotonou, Abomey-Calavi,
Porto-Novo...), inspirée de Vinted. Achat/vente entre particuliers de mode,
friperie et high-tech, avec paiement Mobile Money séquestré jusqu'à la
remise en main propre.

Démo en ligne : https://mon-bazar-benin.netlify.app

## Développement local

**Prérequis :** Node.js

1. Installer les dépendances :
   `npm install`
2. Lancer le serveur de développement :
   `npm run dev`

## Build de production

`npm run build` génère un dossier `dist/` statique (déployé sur Netlify via
`netlify.toml`).

## État actuel

Prototype fonctionnel avec données de démonstration stockées en
`localStorage` (pas de backend partagé, pas de paiement Mobile Money réel,
pas d'authentification par numéro de téléphone) :

- Fil d'annonces filtré par ville/quartier et catégorie
- Fiche produit avec badge "Vendeur vérifié Mobile Money"
- Formulaire de publication d'annonce
- Offres, achat, messagerie, profil vendeur (dashboard)

## Prochaines étapes

1. Intégration Mobile Money réelle (Kkiapay ou Fedapay — MTN/Moov)
2. Backend partagé (base de données) pour remplacer le `localStorage`
3. Authentification par numéro de téléphone (OTP)
