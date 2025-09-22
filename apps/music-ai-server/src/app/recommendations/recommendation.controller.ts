import { AppError, ResultAsync } from '@music-ai/common';
import { Recommendation, Recommendations } from '@music-ai/recommendations';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly _recommendations: Recommendations) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async generate(): ResultAsync<Recommendation[]> {
    const result = await this._recommendations.generate('album');
    return result.map((response) => response.recommendations);
  }

  @Get('test')
  public test(): unknown {
    const error1 = AppError.create('Unexpected Error');
    const error2 = error1.context('Error on lib layer');
    const error3 = error2.context('Error on controller');
    const error4 = error3.context('Another');

    // const error1 = Error('Initial Error');
    // const error2 = AppError.create('Lib Error', error1);
    // const error3 = AppError.create('Controller Error', error2);
    // const error4 = AppError.create('Outro Error', error3).context(
    //   'Something different',
    // );

    console.log(error4.log());

    return 'ok';
  }
}
