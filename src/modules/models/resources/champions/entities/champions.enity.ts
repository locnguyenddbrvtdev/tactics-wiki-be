import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

import { Trait } from '@modules/models/resources/traits/entities/traits.entity';
import { Resource } from '@modules/models/resources/entities/resources.enity';
import { Version } from '@modules/models/resources/sets/entities/versions.entity';

@Entity({ name: 'champions' })
export class Champion extends Resource {
  @ManyToOne(() => Version, (version) => version.champions)
  version: Version;

  @Column({ type: 'jsonb' })
  ability: {
    name: string;
    image: string;
    desc: string;
    variables: { name: string; value: number[] }[];
  };

  @Column({ type: 'integer' })
  cost: number;

  @ManyToMany(() => Trait, (trait) => trait.champions)
  traits: Trait[];

  @Column({ type: 'jsonb' })
  stats: {
    attackSpeed: number;
    critChance: number;
    critMultiplier: number;
    damage: number;
    hp: number;
    initialMana: number;
    mana: number;
    range: number;
    armor: number;
    magicResist: number;
  };

  @Column({ type: 'jsonb' })
  images: {
    // https://raw.communitydragon.org/latest/game/assets/characters/tft12_jax/hud/tft12_jax_square.tft_set12.png
    avatar: string;
    // https://raw.communitydragon.org/latest/game/assets/characters/tft12_jax/skins/base/images/tft12_jax_mobile.tft_set12.png
    square: string;
    //
    splash: string;
  };
}
