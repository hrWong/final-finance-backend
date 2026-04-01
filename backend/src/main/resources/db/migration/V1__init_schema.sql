create table if not exists portfolios (
    id bigint primary key auto_increment,
    name varchar(100) not null,
    base_currency varchar(10) not null default 'USD',
    is_default boolean not null default false,
    description varchar(255) null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp
);

create table if not exists assets (
    id bigint primary key auto_increment,
    symbol varchar(32) not null,
    exchange varchar(32) null,
    name varchar(255) not null,
    name_zh varchar(255) null,
    asset_type varchar(20) not null,
    currency varchar(10) not null,
    country varchar(64) null,
    sector varchar(64) null,
    industry varchar(64) null,
    isin varchar(32) null,
    icon_url varchar(512) null,
    status varchar(20) not null default 'ACTIVE',
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    unique key uq_assets_symbol_exchange (symbol, exchange)
);

create table if not exists transactions (
    id bigint primary key auto_increment,
    portfolio_id bigint not null,
    asset_id bigint not null,
    type varchar(20) not null,
    trade_date date not null,
    quantity decimal(20, 6) not null,
    price decimal(20, 6) not null,
    gross_amount decimal(20, 2) not null,
    commission decimal(20, 2) not null default 0,
    tax decimal(20, 2) not null default 0,
    net_amount decimal(20, 2) not null,
    currency varchar(10) not null,
    note varchar(1000) null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    constraint fk_transactions_portfolio foreign key (portfolio_id) references portfolios (id),
    constraint fk_transactions_asset foreign key (asset_id) references assets (id)
);

create table if not exists portfolio_positions (
    id bigint primary key auto_increment,
    portfolio_id bigint not null,
    asset_id bigint not null,
    quantity decimal(20, 6) not null default 0,
    avg_cost decimal(20, 6) not null default 0,
    cost_basis decimal(20, 2) not null default 0,
    market_value decimal(20, 2) not null default 0,
    unrealized_pnl decimal(20, 2) not null default 0,
    unrealized_pnl_pct decimal(10, 4) not null default 0,
    portfolio_weight decimal(10, 4) not null default 0,
    last_price decimal(20, 6) null,
    price_as_of datetime null,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    unique key uq_positions_portfolio_asset (portfolio_id, asset_id),
    constraint fk_positions_portfolio foreign key (portfolio_id) references portfolios (id),
    constraint fk_positions_asset foreign key (asset_id) references assets (id)
);

create index idx_transactions_portfolio_trade_date on transactions (portfolio_id, trade_date);
create index idx_transactions_asset_trade_date on transactions (asset_id, trade_date);
create index idx_positions_portfolio on portfolio_positions (portfolio_id);

insert into portfolios (id, name, base_currency, is_default, description)
values (1, 'Default Portfolio', 'USD', true, 'Single-user default portfolio')
on duplicate key update name = values(name);
