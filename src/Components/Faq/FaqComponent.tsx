import { useState } from 'react';
import './FaqComponent.css';

const questionsData = [
    {
        question: "Comment puis-je me connecter à mon compte ?",
        answer: "Vous pouvez vous connecter à votre compte en cliquant sur le bouton 'Connexion' situé en haut à droite de la page. Vous devrez ensuite saisir votre adresse e-mail et votre mot de passe pour vous connecter."
    },
    {
        question: "Comment puis-je réinitialiser mon mot de passe ?",
        answer: "Si vous avez oublié votre mot de passe, vous pouvez le réinitialiser en cliquant sur le lien 'Mot de passe oublié ?' situé sous le formulaire de connexion. Vous recevrez alors un e-mail contenant un lien vous permettant de réinitialiser votre mot de passe."
    },
    {
        question: "Comment puis-je m'inscrire sur le site ?",
        answer: "Vous pouvez vous inscrire sur le site en cliquant sur le bouton 'Inscription' situé en haut à droite de la page. Vous devrez ensuite saisir votre adresse e-mail, votre prénom, votre nom et votre mot de passe pour créer un compte."
    },
    {
        question: "Comment puis-je contacter le service client ?",
        answer: "Vous pouvez contacter le service client en envoyant un e-mail à l'adresse suivante : service.client@example.com."
    },
    {
        question: "Quelle est la politique de confidentialité du site ?",
        answer: "Vous pouvez consulter notre politique de confidentialité en cliquant sur le lien 'Politique de confidentialité' situé en bas de la page."
    },
    {
        question: "Puis-je modifier mon adresse e-mail dans mon profil ?",
        answer: "Oui, vous pouvez modifier votre adresse e-mail dans votre profil en accédant à la section 'Paramètres' de votre compte."
    },
    {
        question: "Comment puis-je supprimer mon compte ?",
        answer: "Pour supprimer votre compte, veuillez contacter notre service clientèle via l'adresse e-mail service.client@example.com et fournir les informations nécessaires pour vérification."
    },
    {
        question: "Y a-t-il des frais d'inscription sur le site ?",
        answer: "Non, l'inscription sur notre site est entièrement gratuite."
    },
    {
        question: "Comment puis-je changer mon mot de passe ?",
        answer: "Vous pouvez changer votre mot de passe en accédant à la section 'Paramètres' de votre compte et en sélectionnant l'option 'Changer le mot de passe'."
    },
    {
        question: "Combien de temps faut-il pour recevoir une réponse du service client ?",
        answer: "Nous nous efforçons de répondre à toutes les demandes dans les 24 heures ouvrables."
    },
    {
        question: "Est-il possible de changer mon nom d'utilisateur ?",
        answer: "Non, une fois que votre nom d'utilisateur est créé, il ne peut pas être modifié."
    },
    {
        question: "Comment puis-je supprimer mon compte ?",
        answer: "Pour supprimer votre compte, veuillez contacter notre service clientèle via l'adresse e-mail service.client@example.com et fournir les informations nécessaires pour vérification."
    },
    {
        question: "Quelles sont les méthodes de paiement acceptées sur le site ?",
        answer: "Nous acceptons les paiements par carte de crédit, carte de débit et PayPal."
    },
    {
        question: "Comment puis-je modifier mes préférences de notification ?",
        answer: "Vous pouvez modifier vos préférences de notification en accédant à la section 'Paramètres' de votre compte et en sélectionnant l'option 'Préférences de notification'."
    },
    {
        question: "Puis-je utiliser mon compte sur plusieurs appareils ?",
        answer: "Oui, vous pouvez utiliser votre compte sur plusieurs appareils en vous connectant avec les mêmes identifiants."
    },
];


export default function FaqComponent() {
    const [clickedQuestions, setClickedQuestions] = useState(new Set());
    const [displayedQuestions, setDisplayedQuestions] = useState(questionsData.slice(0, 5));

    const handleClick = (index: number) => {
        const newClickedQuestions = new Set(clickedQuestions);
        if (newClickedQuestions.has(index)) {
            newClickedQuestions.delete(index);
        } else {
            newClickedQuestions.add(index);
        }
        setClickedQuestions(newClickedQuestions);
    };

    const loadMoreQuestions = () => {
        const nextQuestions = questionsData.slice(displayedQuestions.length, displayedQuestions.length + 5);
        setDisplayedQuestions([...displayedQuestions, ...nextQuestions]);
    };

    return (
        <div className='mainContainer'>
            <div className='faq'>
                <h2>Questions fréquentes</h2>
                <div className='questions'>
                    {displayedQuestions.map((question, index) => (
                        <div key={index}>
                            <h3 onClick={() => handleClick(index)}>{question.question}</h3>
                            <p className={clickedQuestions.has(index) ? 'showAnswer' : 'hideAnswer'}>{question.answer}</p>
                        </div>
                    ))}
                </div>
                {questionsData.length > displayedQuestions.length && (
                    <button onClick={loadMoreQuestions}>Charger plus de questions</button>
                )}
            </div>
        </div>
    );
}

