@startuml
!define RECTANGLE class

RECTANGLE Game {
    +startGame(): void
    +endGame(): void
    +saveGame(): void
    +loadGame(): void
}

RECTANGLE Player {
    -id: number
    -name: string
    -resources: Resources
    +updateResources(): void
    +buildStructure(type: string): void
    +researchTech(type: string): void
}

RECTANGLE Resources {
    -metal: number
    -crystal: number
    -deuterium: number
    +addResource(type: string, amount: number): void
}

RECTANGLE Planet {
    -id: number
    -type: string
    +mineResources(): Resources
}

RECTANGLE Fleet {
    -ships: List<Ship>
    +attack(target: Planet): void
    +defend(): void
}

RECTANGLE Ship {
    -type: string
    -attackPower: number
    +move(): void
    +engage(): void
}

Game --> Player : manages >
Player --> Resources : has >
Player --> Fleet : commands >
Planet --> Resources : produces >
Fleet --> Ship : consistsOf >

@enduml