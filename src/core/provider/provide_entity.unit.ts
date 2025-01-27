/**
 * @license
 * Copyright Builder.io, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */

import { TEST_CONFIG } from '../util/test_config';
import { Entity } from '../entity/entity';
import type { EntityKey } from '../entity/entity_key';
import { QRL } from '../import/qrl';
import { getInjector } from '../injector/element_injector';
import { injectFunction } from '../injector/inject';
import type { Injector, Provider } from '../injector/types';
import { ElementFixture } from '@builder.io/qwik/testing';
import { provideEntity } from './provide_entity';

describe('provideEntity', () => {
  let fixture: ElementFixture;
  let hostInjector: Injector; // eslint-disable-line @typescript-eslint/no-unused-vars
  beforeEach(() => {
    fixture = new ElementFixture(TEST_CONFIG);
    hostInjector = getInjector(fixture.host); // eslint-disable-line @typescript-eslint/no-unused-vars
  });

  it('should return entity', async () => {
    RegardsEntity.$attachEntity(fixture.parent);
    const fn = injectFunction(
      provideEntity((() => Promise.resolve('regards:Hello:World')) as any as Provider<
        EntityKey<RegardsEntity>
      >), // TODO(type):
      (entity: RegardsEntity) => entity
    );

    expect((await hostInjector.invoke(fn)).$state).toEqual({
      $key: 'regards:Hello:World',
      greeting: 'Hello World!',
    });
  });
});

interface RegardsProps {
  salutation: string;
  name: string;
}
interface Regards {
  greeting: string;
}

export class RegardsEntity extends Entity<RegardsProps, Regards> {
  static $type = 'regards';
  static $qrl = QRL`test:/provider/provide_entity.unit#RegardsEntity`;
  static $keyProps = ['salutation', 'name'];

  greeting: string = null!;

  async $init() {
    this.greeting = this.$state.greeting;
  }

  async $newState(state: RegardsProps) {
    return { greeting: state.salutation + ' ' + state.name + '!' };
  }
}
