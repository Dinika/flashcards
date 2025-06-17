import { Card, categories, Category, TCategory } from "../types";
import { getCategoryDeck, saveDeckToCategory } from "./local-storage";

const WeightedCardCategories = [
    Category.Difficult,
    Category.Difficult,
    Category.Difficult,
    Category.Difficult,
    Category.Difficult,
    Category.Medium,
    Category.Medium,
    Category.Medium,
    Category.Easy,
    Category.Easy,
];

export function getAllCards(): Card[] {
    const allCards: Card[] = [];
    categories.forEach((category) => {
        const deck = getCategoryDeck(category);
        if (null !== deck) {
            allCards.push(...deck);
        }
    });
    return allCards;
}

export function getRandomCardFromDeck(): Card | null {
    const category =
        WeightedCardCategories[
            Math.floor(Math.random() * WeightedCardCategories.length)
        ];
    let deck = getCategoryDeck(category);

    // If there are no cards in this deck find a card in any other deck
    if (null === deck) {
        deck =
            categories
                .filter((c) => c !== category)
                .map((c) => getCategoryDeck(c))
                .find((d) => null !== d) ?? null;
    }
    // If we still don't find a card, return null
    if (null === deck) {
        return null;
    }

    // Deck is a queue. Pulling the first item from the deck will give us the oldest card for the given category
    return deck[0];
}

/**
 * Adds new card to deck named `category`.
 *
 * If prioriy is high, the card will be placed in the deck in such as way that it is the first one to be retrieved
 * when a card if pulled from that deck. This is a good in case of "word of the day".
 *
 * If low priority (default), the card is placed where it will be last one to be picked. This is good option
 * (for example), for cards that have already recently been seen by the user.
 */
export function addCardToDeck(
    card: Card,
    category: TCategory,
    ignoreIfQuestionExists?: boolean,
    priority?: "high" | "low",
) {
    let deck = getCategoryDeck(category);
    if (null === deck) {
        deck = [];
    }

    if (
        ignoreIfQuestionExists &&
        deck.find((c) => c.question === card.question)
    ) {
        return;
    }

    // Deck is a queue. Place high priority card to the front of the queue, and lower at the end.
    if (priority === "high") {
        deck.unshift(card);
    } else {
        deck.push(card);
    }
    saveDeckToCategory(category, deck);
}

export function updateCardInDeck(
    originalCategory: TCategory,
    cardToUpdate: Card,
) {
    if (originalCategory === cardToUpdate.category) {
        const deck =
            getCategoryDeck(originalCategory)?.map((c) => {
                if (c.id === cardToUpdate.id) {
                    return { ...c, ...cardToUpdate };
                }
                return c;
            }) ?? [];
        saveDeckToCategory(originalCategory, deck);
        return;
    }

    // If the category has changed, we need to remove the card from the original category and add it to the new one
    const originalDeck =
        getCategoryDeck(originalCategory)?.filter(
            (c) => c.id !== cardToUpdate.id,
        ) ?? [];
    saveDeckToCategory(originalCategory, originalDeck);

    const newCategory = cardToUpdate.category;
    const newCategoryDeck = getCategoryDeck(newCategory) ?? [];
    // Deck is a queue. Since this card is newly added to the deck it should be added at the end of the deck so that it is last one to be picked.
    newCategoryDeck.push({ ...cardToUpdate, lastUpdatedAt: Date.now() });
    saveDeckToCategory(newCategory, newCategoryDeck);
}

export function removeCardFromDeck(id: string, category: TCategory) {
    let deck = getCategoryDeck(category);
    if (null === deck) {
        return;
    }

    deck = deck.filter((d) => d.id !== id);
    saveDeckToCategory(category, deck);
}
