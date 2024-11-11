import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CredibilityScoringService {
  private readonly logger = new Logger(CredibilityScoringService.name);
  private readonly huggingFaceToken = process.env.HUGGING_FACE_API_KEY;

  async analyzeContent(content: string): Promise<any> {
    try {
      this.logger.debug("Début de l'analyse du contenu");

      // Troncature du contenu pour respecter la limite en tokens (256)
      const truncatedContent = this.truncateContentByTokens(content, 256);

      // Analyse du sentiment
      const sentiment = await this.runHuggingFaceModelWithRetry(
        truncatedContent,
        'mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis',
      );
      this.logger.debug('Sentiment analysé:', sentiment);

      // Analyse de cohérence
      const coherence = await this.runHuggingFaceModelWithRetry(
        content,
        'microsoft/deberta-v2-xlarge-mnli',
      );
      this.logger.debug('Cohérence analysée:', coherence);

      // Lisibilité (choisir un modèle existant)
      const readability = await this.runHuggingFaceModel(
        truncatedContent,
        'MODEL_FOR_READABILITY', // Remplacer par un modèle de lisibilité
      );
      this.logger.debug('Lisibilité analysée:', readability);

      const credibilityScore = this.calculateScore(
        sentiment,
        coherence,
        readability,
      );
      this.logger.debug('Score de crédibilité calculé:', credibilityScore);

      return { credibilityScore, sentiment, coherence, readability };
    } catch (error) {
      this.logger.error('Erreur dans le calcul de la crédibilité:', error);
      throw new Error('Erreur dans le calcul de la crédibilité');
    }
  }

  private truncateContentByTokens(content: string, maxTokens: number): string {
    const words = content.split(' ');
    let truncatedContent = '';
    let tokenCount = 0;

    for (const word of words) {
      tokenCount += Math.ceil(word.length / 4); // Approximation simple pour 4 caractères/tokens
      if (tokenCount > maxTokens) break;
      truncatedContent += word + ' ';
    }
    return truncatedContent.trim();
  }

  private async runHuggingFaceModel(content: string, model: string) {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          headers: {
            Authorization: `Bearer ${this.huggingFaceToken}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ inputs: content }),
        },
      );
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      this.logger.error(`Erreur lors de l'appel au modèle ${model}:`, error);
      throw error;
    }
  }

  private async runHuggingFaceModelWithRetry(
    content: string,
    model: string,
    retries = 3,
  ) {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await this.runHuggingFaceModel(content, model);
        if (!result.error) {
          return result;
        }
        if (result.error.includes('currently loading')) {
          this.logger.debug(
            `Le modèle ${model} est en cours de chargement, nouvelle tentative dans 10 secondes...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 10000));
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }
      }
    }
  }

  private calculateScore(sentiment, coherence, readability) {
    // Implémentez ici la logique de pondération et de calcul
    return sentiment * 0.3 + coherence * 0.4 + readability * 0.3; // Exemple simplifié
  }
}
